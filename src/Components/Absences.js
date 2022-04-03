import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import "../Style/style.css";

export class Absences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      payload: [],
      currentPage: 1,
      todosPerPage: 10,
      upperPageBound: 10,
      lowerPageBound: 0,
      isPrevBtnActive: 'disabled',
      isNextBtnActive: '',
      pageBound: 10,
      selectedType: "",
      finalMembers: [],
      finalData: []
  };
    this.handleClick = this.handleClick.bind(this);
    this.btnDecrementClick = this.btnDecrementClick.bind(this);
    this.btnIncrementClick = this.btnIncrementClick.bind(this);
    this.btnNextClick = this.btnNextClick.bind(this);
    this.btnPrevClick = this.btnPrevClick.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
  }
      
  componentDidMount() {
    fetch("absences.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            error: null,
            isLoaded: true,
            payload: result.payload,
            finalData: result.payload
          });
        },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error: error,
                payload: []
              });
            }
      )
  }
 
  listOfAbsences() {
    const { payload} = this.state;
    const Length = this.props.memeberName.length
    const Members = this.props.memeberName
    const absencesMembers = []
    let status = '';
    let date1;
    let date2;
    let period;
    
    for (let i = 0; i < payload.length; i++){
      for (let j = 0; j < Length; j++){
        if (payload[i].userId === Members[j].userId) {
          if (payload[i].memberNote === "") {
            payload[i].memberNote = 'not Available'
          }
          if (payload[i].admitterNote === "") {
            payload[i].admitterNote = 'not Available'
          }
          if (payload[i].confirmedAt !== null && payload[i].rejectedAt === null) {
            status = 'Confirmed'
          } else if (payload[i].rejectedAt !== null && payload[i].confirmedAt === null) {
            status = 'Rejected'
          } else if (payload[i].rejectedAt === null && payload[i].confirmedAt === null) {
            status = 'Requested'
          }
          date1 = moment(payload[i].endDate);
          date2 = moment(payload[i].startDate);
          period = date1.diff(date2, 'days');
          const absence =
                <ul className="card" key={i}>
                <li className='btn btn-success'>Members Name:&nbsp;{Members[j].name}</li>
                <li>Type of Absence:&nbsp;{payload[i].type}</li>
                <li>Period:&nbsp;{period}&nbsp;days</li>
                <li>Member Note:&nbsp;{payload[i].memberNote}</li>
                <li>Status:&nbsp;{status}</li>
                <li>Admitter note:&nbsp;{payload[i].admitterNote}</li>
                </ul>
          absencesMembers.push(absence);       
        }
      } 
    }
    return absencesMembers 
  }

  handleClick(event) {
    let listid = Number(event.target.id);
    this.setState({
      currentPage: listid
    });
    $("ul li.active").removeClass('active');
    $('ul li#'+listid).addClass('active');
    this.setPrevAndNextBtnClass(listid);
  }

  setPrevAndNextBtnClass(listid) {
    let totalPage = Math.ceil(this.state.payload.length / this.state.todosPerPage);
    this.setState({isNextBtnActive: 'disabled'});
    this.setState({isPrevBtnActive: 'disabled'});
    if(totalPage === listid && totalPage > 1){
        this.setState({isPrevBtnActive: ''});
    }
    else if(listid === 1 && totalPage > 1){
        this.setState({isNextBtnActive: ''});
    }
    else if(totalPage > 1){
        this.setState({isNextBtnActive: ''});
        this.setState({isPrevBtnActive: ''});
    }
}

btnIncrementClick() {
      this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
      this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
      let listid = this.state.upperPageBound + 1;
      this.setState({ currentPage: listid});
      this.setPrevAndNextBtnClass(listid);
  }
  
btnDecrementClick() {
    this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
    this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
    let listid = this.state.upperPageBound - this.state.pageBound;
    this.setState({ currentPage: listid});
    this.setPrevAndNextBtnClass(listid);
  }
  
btnPrevClick() {
    if((this.state.currentPage -1)%this.state.pageBound === 0 ){
        this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
        this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
    }
    let listid = this.state.currentPage - 1;
    this.setState({ currentPage : listid});
    this.setPrevAndNextBtnClass(listid);
  }
  
handlestartDateChange = (e) => {
    let startDate = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    let resultData = this.state.finalData.filter((i) => {
      return i.startDate.includes(startDate)
    });
    this.setState({
      payload: resultData
    })
  }
  
handleendDateChange = (e) => {
    let endDate = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    let resultData = this.state.finalData.filter((i) => {
      return i.endDate.includes(endDate)
    });
    this.setState({
      payload: resultData
    })
  }

handleTypeChange = (event) => {    
    let filteredPayloadVacation = this.state.finalData.filter(i => i.type.includes(`vacation`));
    let filteredPayloadSickness = this.state.finalData.filter(i => i.type.includes(`sickness`));
    let filteredPayloadAll = this.state.finalData;
    if (event.target.value === 'vacation') {
      this.setState({
        payload: filteredPayloadVacation
      })
    }else if (event.target.value === 'sickness') {
      this.setState({
        payload: filteredPayloadSickness
      })
    } else {
      this.setState({
        payload: filteredPayloadAll
      })
    }
  }
  
btnNextClick() {
    if((this.state.currentPage +1) > this.state.upperPageBound ){
        this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
        this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
    }
    let listid = this.state.currentPage + 1;
    this.setState({ currentPage : listid});
    this.setPrevAndNextBtnClass(listid);
  }
  
  render() {
    const { error, isLoaded,payload, currentPage, todosPerPage,upperPageBound,lowerPageBound,isPrevBtnActive,isNextBtnActive} = this.state;    
    const todos = this.listOfAbsences();
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    const renderTodos = currentTodos.map((todo, index) => {
      return <div className='col-lg-4' key={index} >{todo}</div>;
    });

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }

    let renderPageNumbers = pageNumbers.map(number => {
      if(number === 1 && currentPage === 1){
          return(
              <li key={number} className='active page-item' id={number}><a className='page-link' style={{padding: "10px", textDecoration:"none"}} href="#/" id={number} onClick={this.handleClick}>{number}</a></li>
          )
      }
      else if((number < upperPageBound + 1) && number > lowerPageBound){
          return(
            <li className='page-item' key={number} id={number}>
            <a className='page-link' style={{ padding: "10px", textDecoration: "none" }} href="#/" id={number} onClick={this.handleClick}>{number}</a></li>
          )
      }
      return null
  });
  
  let pageIncrementBtn = null;
  if(pageNumbers.length > upperPageBound){
      pageIncrementBtn = <a className='page-link' href="#/" onClick={this.btnIncrementClick}> &hellip; </a>
    }
    
  let pageDecrementBtn = null;
  if(lowerPageBound >= 1){
      pageDecrementBtn = <a className='page-link'  href="#/" onClick={this.btnDecrementClick}> &hellip; </a>
    }
    
  let renderPrevBtn = null;
  if(isPrevBtnActive === 'disabled') {
    renderPrevBtn = <li className={`${isPrevBtnActive} page-item`}>
      <a className='page-link' id="btnPrev" style={{ padding: "10px", textDecoration: "none" }}  href="#/"> Prev </a></li>
  }
  else{
      renderPrevBtn = <li className={`${isPrevBtnActive} page-item`}><a className='page-link' style={{padding: "10px", textDecoration:"none"}} href="#/" id="btnPrev" onClick={this.btnPrevClick}> Prev </a></li>
    }
    
  let renderNextBtn = null;
  if(isNextBtnActive === 'disabled') {
    renderNextBtn = <li className={`${isNextBtnActive} page-item`}>
      <a className='page-link' id="btnNext" href="#/" style={{ padding: "10px", textDecoration: "none" }}> Next </a></li>
  }
  else{
      renderNextBtn = <li  className={`${isNextBtnActive} page-item`}><a className='page-link' style={{padding: "10px", textDecoration:"none"}} href="#/" id="btnNext" onClick={this.btnNextClick}> Next </a></li>
  }

    //Logic for error if the list is unavailable 
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div> 
          <p>Filter By Using<b>Absence Manager</b></p>
          <div className="type-filter">
            Type :  &nbsp;
            <select id="type-input" name="types"
              onChange={this.handleTypeChange.bind(this)}
            >
              <option value="all">All</option>
              <option value="vacation">Vacation</option>
              <option value="sickness">Sickness</option>
              </select>
              <span> &nbsp;&nbsp;Start Date :&nbsp;&nbsp;</span>
              <input type="date" id="startDate" onChange={this.handlestartDateChange.bind(this)} />
              <span> &nbsp;&nbsp;End Date :&nbsp;&nbsp;</span> 
              <input type="date" id="endDate" onChange={this.handleendDateChange.bind(this)} />
          </div>
          <br/>
          <div><b className='total-absences'>Total Absences || {payload.length} </b>&nbsp; </div>
          <br/>
          <div className='container' >
            <div className='row'>
                {renderTodos}
            </div>
          </div>
          <nav aria-label="Page navigation example" style={{marginLeft: "400px"}}>
            <ul class="pagination">
              {renderPrevBtn}
              {pageDecrementBtn}
              {renderPageNumbers}
              {pageIncrementBtn}
              {renderNextBtn}
            </ul>
          </nav>
          </div>
      );
    }    
  }
}
