// const packageID = document.getElementById('packageID');
// packageID.addEventListener('submit', (req, res) => {
//     const value = req.params;
//     console.log(value);
//     res.redirect(`/packages/${value}`);
// })

const tracker = document.getElementById('tracker')

tracker.addEventListener('submit', function (event) {
    event.preventDefault();
    const packageID = document.getElementById('trackPackage').value;
    window.location = `http://localhost:3000/packages/${packageID}`
})