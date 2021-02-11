const list = document.querySelector('ul')
const form = document.querySelector('form')


list.addEventListener('click', e => {
    if(e.target.tagName === "BUTTON") {
        let id = e.target.parentElement.getAttribute('data-id')

        db.collection("courses").doc(id).delete()
        .then(res => console.log('deleted'))
        .catch(err => console.error(err))
    }
})

form.addEventListener('submit', e => {
    e.preventDefault();

    const now = new Date();

    const course = {
        title: form.course.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    }

    db.collection("courses").add(course)
    .then(res => form.reset())
    .catch(err => console.log(err))
})



addCourse = (course, id) => {
    
    const html = `
    <li class="list-group-item" data-id="${id}">
    <h3>${course.title}</h3>
    <small>${course.created_at.toDate()}</small>
    <button class="btn btn-danger btn-sm my-3">Delete</button>
    </li>`

    list.innerHTML += html
}
const deleteCourse = id => {
    if(confirm('Are you sure to delete this course?'))
    {
        const courses = document.querySelectorAll('li');
    courses.forEach(course => {
        if(course.getAttribute('data-id') === id){
            course.remove();
        }
     })
    }
    
}

db.collection("courses").onSnapshot(snap => {
    console.log(snap.docChanges())
    snap.docChanges().forEach(course => {
        if(course.type === "added") {
            addCourse(course.doc.data(), course.doc.id)
        }else{
            deleteCourse(course.doc.id)
        }
    })
})
    
