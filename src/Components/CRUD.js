import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);

function CRUD() {
  const val = {
    num: "",
    firstname: "",
    lastname: "",
    mail: "",
  };

  let [values, setValues] = useState(val);
  let [rows, setRows] = useState([]);
  let [insert, setInsert] = useState("");
  let [selectedIndex, setSelectedIndex] = useState(null);
  let [errors, setErrors] = useState({});
  let [isSubmit, setIsSubmit] = useState(false);

  //export csv
  const headers = [
    { label: "ID", key: "num" },
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "mail" },
  ];

  //export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Define headers
    const headers = [["ID", "First Name", "Last Name", "Email"]];

    // Prepare rows for table (assuming `rows` is the data array)
    const rowsData = rows.map((row) => [
      row.num,
      row.firstname,
      row.lastname,
      row.mail,
    ]);

    // Add table to PDF
    if (doc.autoTable) {
      doc.autoTable({
        head: headers,
        body: rowsData,
        startY: 20, // Adjust starting Y position (optional)
      });

      // Save the PDF file
      doc.save("user_data.pdf");
    } else {
      console.error("autoTable function not found.");
    }
  };

  //import csv
  const handleImportCSV = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parseData = results.data;
        const updatedRow = [...rows];

        for (let i = 0; i < parseData.length; i++) {
          const item = parseData[i];
          console.log(item);

          const newRow = {
            num: item["ID"],
            firstname: item["First Name"],
            lastname: item["Last Name"],
            mail: item["Email"],
          };
          console.log(newRow);
          updatedRow.push(newRow);
        }

        setRows(updatedRow);
      },
    });
  };

  const validation = (v) => {
    const error = {};
    // const digit = /^\d{}/;
    const alpha = /^[A-Za-z]+$/;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    // if (!v.num) {
    //   error.num = "Id is required!";
    // } else if (digit.test(v.num)) {
    //   error.num = "Write digits only!";
    // }

    if (!v.firstname) {
      error.firstname = "First Name is required!";
    } else if (!alpha.test(v.firstname)) {
      error.firstname = "Write Characters only!";
    }

    if (!v.lastname) {
      error.lastname = "Last Name is required!";
    } else if (!alpha.test(v.lastname)) {
      error.lastname = "Write Characters only!";
    }

    if (!v.mail) {
      error.mail = "Email is required!";
    } else if (!regex.test(v.mail)) {
      error.mail = "Formate is no correct!";
    }

    return error;
  };

  // export JSON
  const downloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(rows, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmit) {
      console.log(values);
    }
  }, [errors, isSubmit, values]);

  //insert
  const handleInsert = () => {
    setInsert("Insert Data");
    setValues({ num: "0", firstname: "", lastname: "", mail: "" });
    setSelectedIndex(null);
    setErrors("");
  };

  //remove
  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this row?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRow = [...rows];
        updatedRow.splice(index, 1);
        setRows(updatedRow);
        Swal.fire("Deleted!", "Row has been deleted.", "success");
      }
    });
  };

  //edit
  const handleEdit = (index) => {
    const selectedRow = rows[index];
    setValues(selectedRow);
    setInsert("Edit data");
    setSelectedIndex(index);
    setErrors("");
  };

  //save
  const saveChange = () => {
    const validationErrors = validation(values);

    setErrors(validationErrors);
    setIsSubmit(true);
    if (Object.keys(validationErrors).length > 0) {
      return; // stop here if there are validation errors
    }

    if (selectedIndex !== null) {
      const updatedRow = [...rows];
      updatedRow[selectedIndex] = values;
      setRows(updatedRow);
      setSelectedIndex(null);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Row updated successfully.",
      });
    } else {
      setRows([...rows, values]);
      Swal.fire({
        icon: "success",
        title: "Inserted!",
        text: "Row added successfully.",
      });
      // setValues({ num: "", firstname: "", lastname: "", mail: "" })
    }

    const closeButton = document.getElementById("cbtn");
    closeButton.click();
  };

  //handle change
  const handleChange = (e) => {
    const newRow = { ...values, [e.target.id]: e.target.value };
    setValues(newRow);
    console.log(newRow);
  };

  return (
    <>
      <div className="bdiv">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={handleInsert}
        >
          INSERT DATA
        </button>
      </div>
      <table className="table">
        <thead className="table">
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Email</th>
            <th scope="col">Edit Row</th>
            <th scope="col">Remove Row</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          {rows.map((row, index) => (
            <tr key={index}>
              <th scope="row">{row.num = index+1}</th>
              <td>{row.firstname}</td>
              <td>{row.lastname}</td>
              <td>{row.mail}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        className="btn btn-success mx-2"
        onClick={downloadJSON}
      >
        Export JSON
      </button>

      <CSVLink
        data={rows}
        headers={headers}
        filename={"user_data.csv"}
        className="btn btn-warning mx-2"
      >
        Export CSV
      </CSVLink>

      <button className="btn btn-danger mx-2" onClick={exportToPDF}>
        Export to PDF
      </button>

      <input
        type="file"
        accept=".csv"
        onChange={handleImportCSV}
        className="form-control w-auto d-inline-block mx-2"
      />

      <div
        className="modal fade "
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Insert data
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <div className="col-md-3 mb-3">
                  <input
                    type="number"
                    id="num"
                    placeholder="Id"
                    className="form-control"
                    onChange={handleChange}
                    value={values.num}
                  />
                  {errors.num && (
                    <div className="text-danger small mt-1">{errors.num}</div>
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <input
                    type="text"
                    id="firstname"
                    placeholder="First name"
                    className="form-control"
                    onChange={handleChange}
                    value={values.firstname}
                  />
                  {errors.firstname && (
                    <div className="text-danger small mt-1">
                      {errors.firstname}
                    </div>
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <input
                    type="text"
                    id="lastname"
                    placeholder="Last name"
                    className="form-control"
                    onChange={handleChange}
                    value={values.lastname}
                  />
                  {errors.lastname && (
                    <div className="text-danger small mt-1">
                      {errors.lastname}
                    </div>
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <input
                    type="email"
                    id="mail"
                    placeholder="Email"
                    className="form-control"
                    onChange={handleChange}
                    value={values.mail}
                  />
                  {errors.mail && (
                    <div className="text-danger small mt-1">{errors.mail}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="cbtn"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                id="savebtn"
                onClick={saveChange}
              >
                {insert}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CRUD;

// <input type="number" id="num" placeholder="Id" aria-label="id" className="form-control" onChange={handleChange} value={values.num}/>
//                     <span className="error-field" style={{color:'red'}}>{errors.num}</span>
//                     <input type="text" id="firstname" placeholder="First name" aria-label="First name" className="form-control" onChange={handleChange} value={values.firstname}/>
//                     <span className="error-field" style={{color:'red'}}>{errors.firstname}</span>
//                     <input type="text" id="lastname" placeholder="Last name" aria-label="Last name" className="form-control" onChange={handleChange} value={values.lastname}/>
//                     <span className="error-field" style={{color:'red'}}>{errors.lastname}</span>
//                     <input type="email" id="mail" placeholder="Email" aria-label="Email" className="form-control" onChange={handleChange} value={values.mail}/>
//                     <span className="error-field" style={{color:'red'}}>{errors.mail}</span>
