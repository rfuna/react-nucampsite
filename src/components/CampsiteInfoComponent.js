import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Row,
  Col,
} from "reactstrap";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Link } from "react-router-dom";
import { addComment } from "../redux/ActionCreators";
import { Loading } from "./LoadingComponent";
import { baseUrl } from '../shared/baseUrl';

const required = (val) => val && val.length;
// test: returns false if max length is exceeded
const maxLength = (len) => (val) => !val || val.length <= len;
// test: returns false if test failed minLength requirement
const minLength = (len) => (val) => val && val.length >= len;

function RenderCampsite({ campsite }) {
  return (
    <div className="col-md-5 m-1">
      <Card>
        <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
        <CardBody>
          <CardText>{campsite.description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
}

function RenderComments({ comments, addComment, campsiteId }) {
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments</h4>
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.text}</p>
            <p>{comment.author}</p>
            <p>
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              }).format(new Date(Date.parse(comment.date)))}
            </p>
          </div>
        ))}
        <CommentForm campsiteId={campsiteId} addComment={addComment} />
      </div>
    );
  }
  return <div></div>;
}

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: "",
      author: "",
      comment: "",
      isModalOpen: false,
      touched: {
        author: false,
      },
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleLogin = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values) {
    this.props.addComment(
      this.props.campsiteId,
      values.rating,
      values.author,
      values.text
    );
  }

  render() {
    return (
      <div>
        <Button type="submit" outline onClick={this.toggleModal}>
          <i className="fa fa-pencil" />
          Submit Comment
        </Button>

        {/* Modal start  */}

        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group">
                <Label htmlFor="rating" md={2}>
                  Rating
                </Label>
                <Col md={10}>
                  <Control.select
                    model=".rating"
                    id="rating"
                    name="rating"
                    defaultValue=""
                    className="form-control"
                  >
                    <option>Select</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="author" md={2}>
                  Last Name
                </Label>
                <Col md={10}>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Your name"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(2),
                      maxLength: maxLength(15),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".lastName"
                    show="touched"
                    component="div"
                    messages={{
                      required: "Required",
                      minLength: "Must be at least 2 characters",
                      maxLength: "Must be 15 characters or less",
                    }}
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="comment" md={2}>
                  Comment
                </Label>
                <Col md={10}>
                  <Control.textarea
                    model=".comment"
                    className="form-control"
                    id="comment"
                    name="comment"
                    rows="12"
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Col md={{ size: 10, offset: 2 }}>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
        {/* Modal end */}
      </div>
    );
  }
}

//========

function CampsiteInfo(props) {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }

  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      </div>
    );
  }

  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <div className="col">
            <RenderComments
              comments={props.comments}
              addComment={props.addComment}
              campsiteId={props.campsite.id}
            />
          </div>
        </div>
      </div>
    );
  }
  return <div />;
}

export default CampsiteInfo;
