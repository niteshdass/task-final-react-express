import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { back, getCategory, remove } from '../auth.js/index.js';
import { API } from '../config';

import moment from 'moment'

const Back = () => {
    const [values, setValues] = useState({
        name: '',
        date: '',
        userid: [],
        optradio:'',
        error: '',
        offer:'',
        success: false
    });


    useEffect(() => {
        get()
    }, [])



    const { name, date, success, error, userid,optradio,offer } = values;
    console.log(name)
    console.log(date)
    console.log(offer)
    console.log("optradio",optradio)
    const handleChange = name => event => {
    
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        back({ name, date,optradio,offer }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    ...values,
                    name: '',
                    date: '',
                    error: '',
                    success: true
                });
            }
        });
    };

    const get = () => {
        getCategory().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, error: false, userid: data })
            }
        })
    }

    const dataTable = JSON.stringify(userid)


    const Form = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Id</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Date</label>
                <input onChange={handleChange('date')}  type="date" pattern="(?:19|20)\[0-9\]{2}-(?:(?:0\[1-9\]|1\[0-2\])-(?:0\[1-9\]|1\[0-9\]|2\[0-9\])|(?:(?!02)(?:0\[1-9\]|1\[0-2\])-(?:30))|(?:(?:0\[13578\]|1\[02\])-31))" 
title="Enter a date in this format YYYY-MM-DD" required  className="form-control" value={date} />
            </div>

     

            <div className="form-group">
                <label className="text-muted">Discount</label>
                <input onChange={handleChange('offer')} type="text" className="form-control" value={offer} />

            </div>


            <div className="form-group">
                <div class="form-check">
                    <label class="form-check-label">
                    
                        <input type="radio" onChange={handleChange('optradio')} value="0" class="form-check-input" name="optradio"/>
                        <label className="text-muted">Flat</label>
                    </label>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                    
                        <input type="radio" onChange={handleChange('optradio')} value="1" class="form-check-input" name="optradio"/>
                        <label className="text-muted">Percentage</label>
                    </label>
                </div>

            </div>


            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Your Id Is create
        </div>
    );

    const show = () => {
        return (
            userid.map((cat, i) => {
                return (
                    <tr onDoubleClick={() => deleteConfirm(cat.name)} key={i} title="Double click has done delete" className="btn btn-outline-primary ml-1 mr-1 mt-3">
                        <td>{cat.name}</td>
                        <td>{moment(cat.date).fromNow()}</td>
                <td>{cat.offer} {cat.optradio==='1'?'Percentage':'Flat'}</td>

                    </tr>

                )




            })
        )
    }

    const deleteConfirm = (slug) => {
        const answer = window.confirm("Are you sure delete this category");
        if (answer) {
            removedConfirm(slug)
        }
    }

    const removedConfirm = ((slug) => {
        console.log(slug)
        remove(slug).then(data => {
            console.log(data)
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, error: false, success: false, removed: true })
            }
        })
    })

    return (
        <Layout
            title="Back"
            description="You can make api"
            className="container col-md-8 offset-md-2"
        >
            {showSuccess()}
            {showError()}
            {Form()}


            <div class="container">
                <h2>User List</h2>

                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Expire Date</th>
                        </tr>
                    </thead>
                    <tbody>

                        {show()}

                    </tbody>
                </table>
            </div>





        </Layout>
    );
};

export default Back;