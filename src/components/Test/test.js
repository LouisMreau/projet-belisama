import './style.css'
import urlExists from 'url-exists'
import {Button} from '@material-ui/core'

const Test = () => {
    const detector_id = 'LCSC'
    var suffixe1 = detector_id + '/' + 'zipFiles' + '/' + '20210723' + '.zip'
    var suffixe2 = detector_id + '/' + 'zipFiles' + '/' + '20210722' + '.zip'
    var url1 = "https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe1
    var url2 = "https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe2
    var urlList = [url1, url2]

    urlExists(url1, function(err, exists) {
    console.log(exists); // true
    });


    const checkExistenceUrl = async (existTable, url) => {
        let answer = await urlExists(url)
        console.log(url)
        console.log(answer)
        existTable.push(answer)
        return existTable
    }

    const checkMultipleUrl = (urlList) => {
        var existTable = []
        urlList.map((url) => {
            checkExistenceUrl(existTable, url).then((answerTable) => {existTable = { ...answerTable}})
            console.log(existTable)
        })
        return !existTable.every(e => e == false)
    }

    return (
        <div>
        <div>Ceci est une zone de tests.</div>
        <Button onClick = {() => {
            console.log(checkMultipleUrl(urlList))}}>
        Test
        </Button> 
        </div>
    )
}

export default Test