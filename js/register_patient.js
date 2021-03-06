var React = require("react");
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link, Navigation } = Router;

var TabBar = require("./tabbar.js");
var Calendar = require('./calendar.js');

var qwest=require('qwest');
qwest.base = baseURL;



var Form = React.createClass({
  mixins: [Navigation],
  contextTypes: {
    router: React.PropTypes.func
  },
  componentWillMount: function() {
    this.props.parent.setState({"tab":"register_patient"})
  },
  getInitialState: function(){
    return {
      failure:false
    }
  },
  verify: function() {
    var e = document.getElementById("gender");
    var gender = e.options[e.selectedIndex].value;
    var dob=document.getElementsByClassName('input-calendar-value')[0].value;
    qwest.post('register/user/',{
          "email":document.getElementById("login-email").value,
          "password":document.getElementById("login-password").value,
          "name":document.getElementById("login-name").value,
          "gender":gender,
          "dob":dob})
          .then(function(response) {
            console.log(response);
            if(response.success) {
              session.uid=response.uid;
              session.token=response.token;
              session.name=response.name;
              session.doctor=false;
              this.transitionTo("patient");
            } else {
              this.setState({failure:true})
            }
          }.bind(this));
  },
  render:function(){
    return (
      <div>
        {this.state.failure?
          (<div className="alert alert-danger" role="alert">Invalid Credentials</div>)
          :""}
        <div className="form-group">
          <label>Email</label>
          <input id="login-email" placeholder="Email"
              className="form-control"/>
        </div>
        <div className="form-group">
          <label>Name</label>
          <input id="login-name" placeholder="Name"
              className="form-control" />
        </div>
        <div className="form-group">
          <label>DOB</label>
          <Calendar
              dateFormatCalendar="YYYY-MM-DD"
              placeholderText="YYYY-MM-DD"
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select id="gender" className="form-control">
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div>
          <div className="form-group">
            <label>Password</label>
            <input id="login-password" placeholder="Password" type="password" className="form-control"/>
          </div>
          <button className="btn btn-primary" onClick={this.verify}>Register</button>
        </div>
      </div>
    )
  }
});

module.exports=Form;
