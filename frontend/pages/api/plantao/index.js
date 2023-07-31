export default function handler(req, res) {
    res.status(200).json([
        {id:'1',escalaid:'1', data:'01/01/2001'},
        {id:'2',escalaid:'1', data:'02/01/2001'},
        {id:'3',escalaid:'1', data:'03/01/2001'},
        {id:'4',escalaid:'1', data:'04/01/2001'},
        {id:'5',escalaid:'1', data:'05/01/2001'},
        {id:'6',escalaid:'2', data:'01/02/2002'},
        {id:'7',escalaid:'2', data:'02/02/2002'},
        {id:'8',escalaid:'2', data:'03/02/2002'},
        {id:'9',escalaid:'2', data:'04/02/2002'}

    ])
}