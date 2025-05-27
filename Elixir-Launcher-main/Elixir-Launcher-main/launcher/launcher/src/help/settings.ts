import useLoading from "src/state/loading";
import { downloadPak } from "./library";
import { invoke } from "@tauri-apps/api";
import useToaster from "src/state/toaster";
import { getFileSizes } from "src/api/files";

export const bubbleWrapPak = async (folderPath: string): Promise<boolean> => {
  const loading = useLoading.getState();
  const toaster = useToaster.getState();
  loading.setPakLoading(true);

  const requiredFiles: Record<string, boolean> = {
    "pakchunk1019-WindowsClient_P.sig": false,
    "pakchunk1019-WindowsClient_P.pak": false,
  };

  const exists = await invoke("check_game_exists", {
    path: folderPath,
  }).catch(() => false);

  if (!exists) {
    toaster.add({
      id: "check game fails",
      message: "Game does not exist.",
      type: "error",
    });
    return false;
  }

  const fileSizes = await getFileSizes();
  if (!fileSizes.success) {
    toaster.add({
      id: "check game fails",
      message: "Failed to get file sizes.",
      type: "error",
    });
    return false;
  }

  for await (const [fileName] of Object.entries(requiredFiles)) {
    let fileExists = await invoke("check_pak_exists", {
      path: folderPath,
      fileName: fileName,
    }).catch(() => false);

    if (!fileExists) {
      console.log("file does not exist", fileName);
      const okay = await downloadPak(
        fileName,
        `${folderPath}\\FortniteGame\\Content\\Paks\\${fileName}`
      );
      if (!okay) {
        toaster.add({
          id: "check game fails",
          message: `Failed to download pak: ${fileName}`,
          type: "error",
        });
        return false;
      }

      requiredFiles[fileName] = true;
      continue;
    }

    const localFileSize = parseInt(
      (await invoke("get_file_size", {
        path: `${folderPath}\\FortniteGame\\Content\\Paks\\${fileName}`,
      }).catch(() => "0")) as string
    );

    if (localFileSize === fileSizes.data["pak/" + fileName]) {
      requiredFiles[fileName] = true;
      continue;
    }

    const okay = await downloadPak(
      fileName,
      `${folderPath}\\FortniteGame\\Content\\Paks\\${fileName}`
    );
    if (!okay) {
      toaster.add({
        id: "check game fails",
        message: `Failed to download pak: ${fileName}`,
        type: "error",
      });
      return false;
    }

    requiredFiles[fileName] = true;
  }

  loading.setPakLoading(false);
  toaster.add({
    id: "bubble wraps",
    message: "Bubble wrap builds successfully activated",
    type: "success",
  });

  window.location.pathname = "/library";
  window.location.reload();

  return true;
};
