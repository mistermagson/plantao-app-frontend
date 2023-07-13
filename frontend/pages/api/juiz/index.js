export default function handler(req, res) {
    res.status(200).json([
    { id:1, nome: 'Dr. Hulk', login:'brucebanner' },
    { id:2, nome: 'Dr. Spider', login:'peterparker' }
    ])
}