import React, { useState } from 'react';
import {
    ListGroup,
    ListGroupItem,
} from "reactstrap";
import classnames from 'classnames'
import { Type, AtSign } from 'react-feather'

function ForYou({ type }) {
    const [activeList, setActiveLIst] = useState('1')

    const toggleList = list => {
        if (activeList !== list) {
            setActiveLIst(list)
        }
    }
    return (
        <>
            <ListGroup tag='div'>
                <ListGroupItem key="1"
                    className={classnames('cursor-pointer', {
                        active: activeList === '1'
                    })}
                    onClick={() => {
                        toggleList('1')
                        type('my_text')
                    }}
                    action
                >
                    <span className='me-1'>
                        <Type size={16} />
                    </span>
                    <span>Text</span>
                </ListGroupItem>
                <ListGroupItem key="2"
                    className={classnames('cursor-pointer', {
                        active: activeList === '2'
                    })}
                    onClick={() => {
                        toggleList('2')
                        type('my_signature')

                    }}
                    action
                >
                    <span className='me-1'>
                        <AtSign size={16} />
                    </span>
                    <span>Signature</span>
                </ListGroupItem>
                <ListGroupItem
                    className={classnames('cursor-pointer', {
                        active: activeList === '3'
                    })}
                    onClick={() => toggleList('3')}
                    action
                >
                    Date
                </ListGroupItem>
                <ListGroupItem
                    className={classnames('cursor-pointer', {
                        active: activeList === '4'
                    })}
                    onClick={() => toggleList('4')}
                    action
                >
                    Settings
                </ListGroupItem>
            </ListGroup>
        </>
    );
}

export default ForYou;
