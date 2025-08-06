import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { Formik } from 'formik'

function CRUD2() {
  const [rows, setRows] = useState([])
  const [insert, setInsert] = useState("Insert Data")
  const [selectedIndex, setSelectedIndex] = useState(null)

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rows, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "data.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleInsert = (resetForm) => {
    setInsert("Insert Data")
    setSelectedIndex(null)
    resetForm()
  }

  const handleEdit = (index, setValues) => {
    const selectedRow = rows[index]
    setInsert("Edit Data")
    setSelectedIndex(index)
    setValues(selectedRow)
  }

  const handleDelete = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this row?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRows = [...rows]
        updatedRows.splice(index, 1)
        setRows(updatedRows)
        Swal.fire('Deleted!', 'Row has been deleted.', 'success')
      }
    })
  }

  return (
    <Formik
      initialValues={{
        num: "",
        firstname: "",
        lastname: "",
        mail: ""
      }}
      validate={(values) => {
        const errors = {}
        if (!values.num) errors.num = "ID is required"
        if (!values.firstname) errors.firstname = "First name is required"
        if (!values.lastname) errors.lastname = "Last name is required"
        if (!values.mail) errors.mail = "Email is required"
        return errors
      }}
      onSubmit={(values, { resetForm }) => {
        if (selectedIndex !== null) {
          const updated = [...rows]
          updated[selectedIndex] = values
          setRows(updated)
          setSelectedIndex(null)
          Swal.fire('Updated!', 'Row updated successfully.', 'success')
        } else {
          setRows([...rows, values])
          Swal.fire('Inserted!', 'Row added successfully.', 'success')
        }

        const closeButton = document.getElementById("cbtn")
        if (closeButton) closeButton.click()
        resetForm()
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <div className="bdiv">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => handleInsert(formik.resetForm)}
            >
              INSERT DATA
            </button>
          </div>

          <table className="table">
            <thead className="table">
              <tr>
                <th>#</th>
                <th>First</th>
                <th>Last</th>
                <th>Email</th>
                <th>Edit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <th>{row.num}</th>
                  <td>{row.firstname}</td>
                  <td>{row.lastname}</td>
                  <td>{row.mail}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => handleEdit(index, formik.setValues)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
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

          {/* Modal */}
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Insert data</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <div className="input-group">
                    <input
                      type="number"
                      name="num"
                      className="form-control"
                      placeholder="ID"
                      value={formik.values.num}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <input
                      type="text"
                      name="firstname"
                      className="form-control"
                      placeholder="First name"
                      value={formik.values.firstname}
                      onChange={formik.handleChange}
                    />
                    <input
                      type="text"
                      name="lastname"
                      className="form-control"
                      placeholder="Last name"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                    />
                    <input
                      type="email"
                      name="mail"
                      className="form-control"
                      placeholder="Email"
                      value={formik.values.mail}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button id="cbtn" type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {insert}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  )
}

export default CRUD2
