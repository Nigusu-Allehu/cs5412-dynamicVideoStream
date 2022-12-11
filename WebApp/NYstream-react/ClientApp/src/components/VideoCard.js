import { React, Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, NavLink
} from 'reactstrap';
import './VideoCard.css';
import { Link } from 'react-router-dom';
export function VideoCard(props) {

    function play(path){

   
    }

    
        return (
            <div>
                <Card>

                    <CardBody>
                        <CardTitle>{props.name}</CardTitle>
                        <NavLink tag={Link} className="watch_btn" to={"/watch/" + props.id}>Watch</NavLink>
                    </CardBody>
                </Card>
            </div>
        );
    
};

