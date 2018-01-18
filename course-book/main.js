(function () {
  function showCourses() {
    const courses = courseBook.getCourses()
    let str = ''
    for (let i = 0; i < courses.length; i++) {
      str += `<a class="select-course" href="#select?course=${i}" data-course="${i}">${courses[i].name}</a> `
    }
    $('#courses-list').html(str)
  }

  function showCurrentCourse() {
    $("#current-course-name").html(courseBook.getCurrentCourseName())
  }

  function showStudents() {
    const students = courseBook.getStudents()
    if (students) {
      let str = ""
      for (let i = 0; i < students.length; i++) {
        str += `<li>
<a class="select-student" href="#select?student=${i}">${students[i]}</a></li>`
      }
      $("#students-list").html(str)
    }
  }

  function showPairs() {
    const pairs = courseBook.getPairs()
    console.log("pairs", pairs)
    if (pairs === undefined) {
      $("#show-pairs").html("no pairs")
      return
    }
    let str = ""
    for (let i = 0; i < pairs.length; i++) {
      str += `<li>Pair ${i+1} <ul>`
      for (let j = 0; j < pairs[i].length; j++) {
        str += `<li>${pairs[i][j]}</li>`
      }
      str += '</ul></li>'
    }
    $("#show-pairs").html(str)
  }

  function refresh() {
    showCourses()
    showCurrentCourse()
    showStudents()
    showPairs()
  }

  function pickRandomStudent() {
    const student = courseBook.nextStudent()
  }

  refresh()

  // ---------------------------------------------------------

  $('body').on('click', '#pick-random-student', function (e) {
    const student = courseBook.nextStudent()
    console.log(student)
    if (student) {
      $("#random-student").html(student)
    } else {
      courseBook.randomizeStudents()
      $("#random-student").html('All students picked')
    }
  })

  $('body').on('click', '.select-course', function (e) {
    const courseIndex = Number($(this).data('course'))
    courseBook.selectCourse(courseIndex)
    refresh()
    $("#random-student").html("?")
  })

  $('body').on('click', '#delete-current-course', function (e) {
    const courseName = courseBook.getCurrentCourseName()
    let shouldDelete = confirm(`Are you sure you want to delete ${courseName}`)

    if (shouldDelete) {
      courseBook.deleteCurrentCourse()
    }

    courseBook.selectCourse(courseIndex)
    refresh()
    $("#random-student").html("?")
  })

  $('body').on('click', '#delete-current-student', function (e) {
    const studentName = courseBook.getCurrentCourseName()
    let shouldDelete = confirm(`Are you sure you want to delete ${studentName}`)

    if (shouldDelete) {
      courseBook.deleteCurrentStudent()
    }

    refresh()
    $("#random-student").html("?")
  })

  $('body').on('click', '#pick-pairs', function (e) {
    courseBook.pairStudents()
    showPairs()
  })

  $('body').on('submit', '#add-new-course', function (e) {
    e.preventDefault()
    const newCourseName = $('#new-course-name').val()
    if (newCourseName.length > 0) {
      courseBook.addCourse(newCourseName)
      $('#new-course-name').val()
      refresh()
    }
  })

  $('body').on('submit', '#add-new-student', function (e) {
    e.preventDefault()
    const newStudentName = $('#new-student-name').val()
    if (newStudentName.length > 0) {
      courseBook.addStudent(newStudentName)
      $('#new-student-name').val("")
      refresh()
    }
  })

})()
