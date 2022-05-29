import React from 'react';
import "./details.css";
import { ObjectValue } from "./ObjectValue";
import { ArrayValue } from "./ArrayValue";

export const Details = (props) => {

  const showPackage = (pkg) => {
    if (props.dependency) {
      props.showDependency(pkg);
    }
  }

  const isInstalled = (pkg) => {
    const list = props.data.some(x => x['name'] === pkg);
    if (!list) return false;

    return true;
  }

  return (
    <>
      {props.pkg !== "" ? (
        <>
          {Object.entries(props.pkg).map((pkg, i) => {
            if (pkg[0] === "DEPENDENCIES" || pkg[0] === "version") return null;

            if (typeof pkg[1] === "object" && !Array.isArray(pkg[1])) {
              return (
                <div key={i} className="pkg">
                  {!props.dependency
                    ? (
                      <>
                        <div className="pkg-keys">
                          <span onClick={() => showPackage(pkg)}>{pkg[0].toUpperCase()}</span>
                        </div>
                        <div className="pkg-values">
                          <ObjectValue pkg={pkg[1]} _key={i} />
                        </div>
                      </>
                    )
                    :
                    (
                      <div className="pkg-keys">
                        {
                          <span className={
                            isInstalled(pkg[0])
                              ? "dependency-clickable"
                              : "disabled"}
                            onClick={() => showPackage(pkg)}>{pkg[0].toUpperCase()}
                          </span>
                        }
                      </div>
                    )
                  }

                </div>
              );
            }

            else {
              return (
                <div key={i} className="pkg">
                  {!props.dependency
                    ?
                    (
                      <>
                        <div className='pkg-keys'>
                          <span onClick={() => showPackage(pkg)}>{pkg[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="pkg-values">
                          {
                            Array.isArray(pkg[1])
                              ?
                              (
                                <ArrayValue item={pkg[1]} />
                              )
                              :
                              (
                                <p>{pkg[1]}</p>
                              )
                          }
                        </div>
                      </>
                    )
                    :
                    (
                      <div className="pkg-keys">
                        <span className={
                          isInstalled(pkg[0])
                            ? "dependency-clickable"
                            : "disabled"}
                          onClick={() => showPackage(pkg)}>{pkg[0].toUpperCase()}
                        </span>
                      </div>
                    )
                  }
                </div>
              );
            }
          })}
        </>
      ) : null}
    </>
  );
};
