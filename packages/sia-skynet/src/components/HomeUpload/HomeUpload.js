import React, { Component } from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import Reveal from "react-reveal/Reveal";

import { Button, UploadFile } from "../";
import { Deco3, Deco4, Deco5, Folder, DownArrow } from "../../svg";
import "./HomeUpload.scss";

export default class HomeUpload extends Component {
  state = { files: [] };

  handleDrop = async acceptedFiles => {
    this.setState({
      files: [
        ...acceptedFiles.map(file => {
          return { file, status: "uploading" };
        }),
        ...this.state.files
      ]
    });

    acceptedFiles.forEach(async file => {
      const url = `/api/skyfile?filename=${file.name}`;
      const fd = new FormData();
      fd.append("file", file);

      const onComplete = (status, skylink) => {
        this.setState(state => {
          const index = state.files.findIndex(f => f.file === file);

          return {
            files: [
              ...state.files.slice(0, index),
              {
                ...state.files[index],
                status,
                url: `https://siasky.net/${skylink}`
              },
              ...state.files.slice(index + 1)
            ]
          };
        });
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          body: fd,
          mode: "cors"
        });
        const { skylink } = await response.json();

        onComplete("complete", skylink);
      } catch (error) {
        onComplete("error");
      }
    });
  };

  handleSkylink = (event) => {
    event.preventDefault();

    const skylink = event.target.skylink.value.replace('sia://', '');

    if(skylink.length === 46) {
      window.open(`/${event.target.skylink.value}`, '_blank');
    }
  }

  render() {
    return (
      <Reveal effect="active">
        <div className="home-upload">
          <div className="home-upload-white fadeInUp delay4">
            <div className="home-upload-split">
              <div className="home-upload-box ">
                <Dropzone
                  onDrop={acceptedFiles => this.handleDrop(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <>
                      <div
                        className={classNames("home-upload-dropzone", {
                          "drop-active": isDragActive
                        })}
                        {...getRootProps()}
                      >
                        <span className="home-upload-text">
                          <h3>Pin a File</h3>
                          Drag &amp; drop your file(s) here to pin
                        </span>
                        <Button iconLeft>
                          <Folder />
                          Browse
                        </Button>
                      </div>
                      <input {...getInputProps()} className="offscreen" />
                    </>
                  )}
                </Dropzone>

                {this.state.files.length > 0 && (
                  <div className="home-uploaded-files">
                    {this.state.files.map((file, i) => {
                      return <UploadFile key={i} {...file} />;
                    })}
                  </div>
                )}
              </div>

              <div className="home-upload-retrieve">
                <div className="home-upload-text">
                  <h3>Have a Skylink?</h3>
                  <p>Enter the ID to retrieve the file</p>

                  <form className="home-upload-retrieve-form" onSubmit={this.handleSkylink}>
                    <input name="skylink" type="text" placeholder="sia://" />
                    <button type="submit">
                      <DownArrow />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <p className="bottom-text fadeInUp delay5">
            Once a file has been uploaded, a 46 byte link called a 'Skylink' is
            generated. That link can then be shared with anyone to fetch the
            file from Skynet.
          </p>

          <Deco3 className="deco-3 fadeInUp delay6" />
          <Deco4 className="deco-4 fadeInUp delay6" />
          <Deco5 className="deco-5 fadeInUp delay6" />
        </div>
      </Reveal>
    );
  }
}
