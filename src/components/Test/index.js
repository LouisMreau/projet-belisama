import {React, useState, useEffect, useRef, Component } from 'react'
import JSZip from 'jszip';

import FileSaver from 'file-saver';
import {Button, CircularProgress} from '@material-ui/core';



const Test = (props) => {

    const StringMonth = ["blabla/202105.zip", "blabla/202105.zip"]
    const StringDay = ["bliblibli/20210701.zip","bliblibli/20210702.zip","bliblibli/20210703.zip"]
    
    const fileNaming = (text) => {
        const regex = /[0-9]+/g;
        console.log(text.search(regex))
        console.log(text.slice(text.search(regex)))
    }

return (

    <Button onClick = {()=> fileNaming(StringMonth[0])}>Test</Button>
)
}

export default Test


