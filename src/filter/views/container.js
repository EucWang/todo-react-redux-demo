import React from 'react';
import * as FilterType from '../../constants.js'
import Link from './Link.js'
import './index.css';
const view = ()=>(
    <div className="filters">
        <Link>{FilterType.ALL}</Link>
        <Link>{FilterType.ACTIVE}</Link>
        <Link>{FilterType.COMPLETED}</Link>
    </div>
);


export default view;