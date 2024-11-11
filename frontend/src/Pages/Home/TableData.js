import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  // Function to generate and download the table data as PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Transaction Table", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [["Date", "Title", "Amount", "Type", "Category", "Description"]],
      body: transactions.map((item) => [
        moment(item.date).format("YYYY-MM-DD"),
        item.title,
        item.amount,
        item.transactionType,
        item.category,
        item.description,
      ]),
    });
    doc.save("transactions.pdf");
  };

  const handleEditClick = (itemKey) => {
    const editTran = props.data.filter((item) => item._id === itemKey);
    setCurrId(itemKey);
    setEditingTransaction(editTran);
    handleShow();
  };

  const handleEditSubmit = async (e) => {
    const { data } = await axios.put(`${editTransactions}/${currId}`, {
      ...values,
    });
    if (data.success === true) {
      await handleClose();
      await setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const handleDeleteClick = async (itemKey) => {
    console.log(user._id);
    console.log("Clicked button ID delete:", itemKey);
    setCurrId(itemKey);
    const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
      userId: props.user._id,
    });
    if (data.success === true) {
      await setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data, props.user, refresh]);

  return (
    <>
      <Container>
        <Button variant="primary" onClick={downloadPdf} className="mb-3">
          Download as PDF
        </Button>
        <Table responsive="md" className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {props.data.map((item, index) => (
              <tr key={index}>
                <td>{moment(item.date).format("YYYY-MM-DD")}</td>
                <td>{item.title}</td>
                <td>{item.amount}</td>
                <td>{item.transactionType}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      key={item._id}
                      id={item._id}
                      onClick={() => handleEditClick(item._id)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      key={index}
                      id={item._id}
                      onClick={() => handleDeleteClick(item._id)}
                    />

                    {editingTransaction ? (
                      <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Update Transaction Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form onSubmit={handleEditSubmit}>
                            {/* Form fields */}
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={handleEditSubmit}
                          >
                            Submit
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default TableData;
