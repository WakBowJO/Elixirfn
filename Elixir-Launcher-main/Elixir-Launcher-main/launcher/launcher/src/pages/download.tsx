import {
  calculateDownloadTime,
  formatBytes,
  handleDownload,
} from "src/help/download";

import useLoading from "src/state/loading";
import useBuilds from "src/state/builds";

import { FaDownload } from "react-icons/fa6";
import "src/styles/pages/download.css";
import { useEffect } from "react";

const DownloadPage = () => {
  const buildState = useBuilds();

  const builds = [
    {
      build: "11.31",
      cl: "11.31-CL-N/A",
      release_date: "15-10-2019",
      download: "https://builds.elixirfn.com/versions/11.31.rar",
    },
  ];

  console.log(buildState.availableBuilds);

  useEffect(() => {
    buildState.availableBuilds.length <= 0 &&
      !buildState.fetchedOnce &&
      buildState.fetchAvailableBuilds();
  }, []);

  return (
    <div className="download">
      {builds.map((build, index) => (
        <>
          <Download build={build} key={index} />
        </>
      ))}
    </div>
  );
};

type Download = {
  build: string;
  cl: string;
  release_date: string;
  download: string;
};

const Download = (props: { build: Download }) => {
  const loadingState = useLoading();

  return (
    <>
      <div
        className={
          loadingState.buildDownloadLoading === true
            ? "dl-container download-build"
            : "dl-container"
        }
        //className="dl-container"
        onClick={() =>
          loadingState.buildDownloadLoading === true
            ? console.log("build already downloading")
            : handleDownload(props.build.download, props.build.build)
        }
      >
        <div className="logo">
          <img
            src={"https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png"}
            alt="logo"
          />
          <div className="info">
            <h2>Fortnite {props.build.build}</h2>
            <p>{props.build.cl}</p>
          </div>
        </div>
        <div className="download-build">
          <div className="item">
            <FaDownload />
          </div>
        </div>
      </div>
      {loadingState.buildDownloadLoading === true ? (
        <>
          {loadingState.buildDownloadProgress.filesize === 0 ? (
            <div className="progress-build">
              <h4>Download is starting...</h4>
            </div>
          ) : (
            <div className="progress-build">
              <div className="bar">
                <div
                  className="value"
                  style={{
                    width: `${loadingState.buildDownloadProgress.percentage}%`,
                  }}
                ></div>
              </div>
              <div className="details">
                <h4>
                  About {""}
                  {calculateDownloadTime(
                    loadingState.buildDownloadProgress.transfer_rate,
                    loadingState.buildDownloadProgress.filesize,
                    loadingState.buildDownloadProgress.transfered
                  )?.toFixed()}{" "}
                  {""}
                  min left
                </h4>
                <h4>{`${formatBytes(
                  loadingState.buildDownloadProgress.transfered
                )} / ${formatBytes(
                  loadingState.buildDownloadProgress.filesize
                )} (${formatBytes(
                  loadingState.buildDownloadProgress.transfer_rate
                )}/s)`}</h4>
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default DownloadPage;
