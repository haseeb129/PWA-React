import React, { useState } from "react";
import * as serviceWorker from "../serviceWorker";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";

const CustomForm = () => {
  const [inputValue, setinputValue] = useState(
    "Testing backgroundSync with dummy Value"
  );

  const [isSuccess, setIsSuccess] = useState(false);

  const addHandler = () => {
    setIsSuccess(false);
    const dummyValue = {
      userId: 1,
      id: 1,
      title: "inputValue",
    };
    if (!navigator.onLine) {
      serviceWorker.registerSync();
      insertIntoDatabase(JSON.stringify(dummyValue));
    } else {
      console.log("addHandler");
      fetch("https://jsonplaceholder.typicode.com/albums", {
        method: "POST",
        body: JSON.stringify(dummyValue),
      })
        .then((response) => {
          if (response) {
            setIsSuccess(true);
          }
        })
        .catch((error) => {
          console.log("Error API", error);
        });
    }
  };

  const insertIntoDatabase = (data) => {
    console.log("insertIntoDatabase", data);
    var indexDBOpenRequest = window.indexedDB.open("order", 1);
    indexDBOpenRequest.onupgradeneeded = function () {
      this.result.createObjectStore("order_request", {
        autoIncrement: true,
      });
    };

    indexDBOpenRequest.onsuccess = function () {
      let db = this.result;
      let transaction = db.transaction("order_request", "readwrite");
      let storeObj = transaction.objectStore("order_request");
      storeObj.add(data);
      console.log("Form onsuccess");
    };

    indexDBOpenRequest.onerror = function (error) {
      console.log("index Error", error);
    };
  };

  return (
    <>
      <div className="w-50 m-auto">
        {isSuccess && <Alert variant="success">Request Submiited</Alert>}

        <div>
          <Form.Label className="float-left font-weight-bold">
            User ID
          </Form.Label>
          <Form.Control placeholder="User ID" value={1} disabled />
          <br />
        </div>
        <div>
          <Form.Label className="float-left font-weight-bold">ID</Form.Label>
          <Form.Control placeholder="ID" value={1} disabled />
          <br />
        </div>
        <div>
          <Form.Label className="float-left font-weight-bold">Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Title"
            onChange={(e) => {
              setinputValue(e?.target?.value);
            }}
            value={inputValue}
          />
        </div>
        <br />

        <Button onClick={addHandler}>Testing Backgound Sync</Button>
      </div>
    </>
  );
};

export default CustomForm;
