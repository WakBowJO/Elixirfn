import { open } from "@tauri-apps/api/dialog";

import useAuth from "src/state/auth";
import useBuilds from "src/state/builds";

//import { bubbleWrapPak } from "src/help/settings";

import DefaultButton from "src/core/button";

import { HiFolderOpen, HiUser } from "react-icons/hi";
import "src/styles/pages/settings.css";

const SettingsPage = () => {
  const auth = useAuth();
  const builds = useBuilds();

  const handleChangePath = async () => {
    const selectedPath = await open({ directory: true, multiple: false });
    if (!selectedPath) return;

    builds.setDownloadPath(selectedPath.toString());
  };

  /*   const handleCheckbox = (checked: boolean) => {
    const state = checked ? "yes" : "false";
    builds.setBubbleWrapEnabled(state);
    if (checked) {
      builds.builds.forEach(async (build) => {
        bubbleWrapPak(build.path);
      });
    } else {
      builds.builds.forEach((build) => {
        invoke("delete_pak", {
          path: build.path,
          fileName: "pakchunk1019-WindowsClient_P.pak",
        });

        invoke("delete_pak", {
          path: build.path,
          fileName: "pakchunk1019-WindowsClient_P.sig",
        });
      });
      window.location.reload();
    }
  }; */

  return (
    <div className="settings">
      <div className="info">
        <div className="avatar">
          <HiUser />
        </div>
        <div className="data">
          <div className="name">
            <h2>{auth.user.username}</h2>
            {/* <span className="colour">TIER 2 DONATOR</span> */}
          </div>
          <p className="smol">{auth.user.accountId}</p>
        </div>
        <DefaultButton
          style={{
            marginLeft: "auto",
          }}
          onClick={() => auth.logout()}
        >
          Log Out
        </DefaultButton>
      </div>
      <div className="info">
        <div className="avatar">
          <HiFolderOpen />
        </div>
        <div className="data">
          <h2>Download Path</h2>
          <p className="smol">
            {builds.downloadPath
              ? builds.downloadPath
              : "No default download path chosen!"}
          </p>
        </div>
        <DefaultButton
          style={{
            marginLeft: "auto",
          }}
          onClick={handleChangePath}
        >
          Change
        </DefaultButton>
      </div>
      {/*       <div className="info">
        <div className="avatar">
          <HiOfficeBuilding />
        </div>
        <div className="data">
          <h2>Bubble Wrap Builds</h2>
          <p className="smol">Enable/Disable bubble wrap builds ingame</p>
        </div>
        <input
          style={{
            marginLeft: "auto",
          }}
          className="bubble-checkbox"
          type="checkbox"
          checked={builds.bubbleWrapEnabled}
          onChange={(e) => handleCheckbox(e.target.checked)}
        />
      </div> */}
    </div>
  );
};

export default SettingsPage;
