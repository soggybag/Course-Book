  // TODO: Wrap this in a IIF
  // **************************************************
  // CourseBook
  //

  // - Define CourseBook
  function CourseBook() {
    this.loadCourses();
    this.currentCourse = this.courses.length === 0 ? 0 : -1
  }

  // - CourseBook name for local storage
  CourseBook.name = 'coursebook'

  // **************************************************
  // Course
  function Course(name, students = []) {
    this.name = name
    this.students = students
    this.pairs = []
    this.currentStudent = -1
  }
  // *************************************************

  // --------------------------------------------------
  // CourseBook methods
  // --------------------------------------------------

  // - Save Save Course to local storage
  CourseBook.prototype.saveCourses = function() {
    localStorage.setItem(CourseBook.name, JSON.stringify(this.courses))
  }

  // - Load course from local storage
  CourseBook.prototype.loadCourses = function() {
    const coursesStr = localStorage.getItem(CourseBook.name)

    if (coursesStr === null) {
      this.courses = []
    } else {
      this.courses = JSON.parse(coursesStr)
    }
  }

  // - Add new course
  CourseBook.prototype.addCourse = function(name) {
    this.courses.push(new Course(name))
    this.currentCourse = this.courses.length - 1
    this.saveCourses()
  }

  // - Delete Current Course
  CourseBook.prototype.deleteCurrentCourse = function() {
    if (this.currentCourse === -1) {
      throw new Error("Must choose a course before deleting")
    }
    this.courses.splice(this.currentCourse, 1)
    this.saveCourses()
    this.currentCourse = -1
  }

  CourseBook.prototype.deleteCurrentStudent = function() {
    const course = this.courses[this.currentCourse]
    if (course.currentStudent === -1) {
      throw new Error("Must choose a student before deleting")
    }

    course.students.splice(course.currentStudent, 1)
    this.saveCourses()
    course.currentStudent = -1
  }

  // - Get courses
  CourseBook.prototype.getCourses = function() {
    return this.courses.slice()
  }

  // - Get a course
  CourseBook.prototype.getCourse = function(i) {
    return this.courses[i]
  }

  // - Get Current Course name
  CourseBook.prototype.getCurrentCourseName = function() {
    const course = this.courses[this.currentCourse]
    if (course) {
      return course.name
    }
    return undefined
  }

  // - Select current course
  CourseBook.prototype.selectCourse = function(i) {
    if (i < 0 || i > this.courses.length - 1) {
      throw new Error("Course index out of range")
    }

    this.currentCourse = i
    this.saveCourses()
  }

  // - Add a student to a course
  CourseBook.prototype.addStudent = function(name) {
    if (this.currentCourse === -1) {
      throw new Error("must choose course before adding student")
    }

    this.courses[this.currentCourse].students.push(name)
    this.saveCourses()
  }

  CourseBook.prototype.deleteStudent = function(index) {
    const course = this.courses[this.currentCourse].students.splice(index, 1)
  }

  // - Randomize student list
  CourseBook.prototype.randomizeStudents = function() {
    const course = this.courses[this.currentCourse]
    const students = course.students.slice()
    const randomStudents = randomize(students)

    course.students = randomStudents
    course.currentStudent = -1
    this.saveCourses()
  }

  // - Get Students
  CourseBook.prototype.getStudents = function() {
    const course = this.courses[this.currentCourse]
    if (course !== undefined) {
      return course.students.slice()
    }
    return false
  }

  // - Next Student
  CourseBook.prototype.nextStudent = function() {
    const course = this.courses[this.currentCourse]
    course.currentStudent += 1

    console.log(">", course.currentStudent)
    this.saveCourses()

    if (course.currentStudent < course.students.length) {
      return course.students[course.currentStudent]
    }
    return false
  }

  // - Pair students
  CourseBook.prototype.pairStudents = function() {
    const course = this.courses[this.currentCourse]
    const randomStudents = randomize(course.students.slice())
    const pairs = []
    for (let i = 0; i < randomStudents.length; i += 2) {
      pairs.push([])
    }

    for (let i = 0; i < randomStudents.length; i++) {
      pairs[Math.floor(i / 2)].push(randomStudents[i])
    }

    course.pairs = pairs
    this.saveCourses()
  }

  // - Get student pairs
  CourseBook.prototype.getPairs = function() {
    const course = this.courses[this.currentCourse]
    console.log(course)
    if (course === undefined) {
      return undefined
    }

    return course.pairs
  }

  // - Pick student
  CourseBook.prototype.pickStudent = function(i) {
    const course = this.courses[this.currentCourse]
    if (i < 0 || i >= course.students.length) {
      throw new Error("Can't pick student out of range")
    }

    course.currentStudent = i
    this.saveCourses()
    return course.students[i]
  }

  // - Count Students
  CourseBook.prototype.studentCount = function() {
    return this.courses[this.currentCourse].students.length
  }


  // --------------------------------------

  // Utils

  function random(range) {
    return Math.floor(Math.random() * range)
  }

  function randomize(array) {
    const randomArray = []
    while (array.length > 0) {
      randomArray.push(array.splice([random(array.length)], 1)[0])
    }
    return randomArray
  }
  // --------------------------------------

  // **********************************************************

  // Test CourseBook

  const courseBook = new CourseBook() // make a new instance of courcebook

  /*
  courseBook.addCourse('Web 2') // add a course
  courseBook.selectCourse(0) // Select a course
  const web_2 = courseBook.getCourse(0) // get the course
  courseBook.addStudent('Joe') // Add some students
  courseBook.addStudent('Julie')
  courseBook.addStudent('Jayce')
  courseBook.addStudent('Juan')
  courseBook.addStudent('Shane')
  courseBook.addStudent('Johnathan')
  console.log('-------------------------------------------')
  console.log(courseBook.studentCount())
  console.log('-------------------------------------------')
  console.log(courseBook.getCourses()) // Get the coursebook
  console.log(web_2) // Get the course
  console.log('-------------------------------------------')
  courseBook.randomizeStudents() // Randomize students in the current course
  console.log(courseBook.getStudents())
  console.log('-------------------------------------------')
  // Test next student
  let nextStudent = true;
  while (nextStudent) {
    nextStudent = courseBook.nextStudent()
    console.log(nextStudent)
  }

  console.log('-------------------------------------------')
  courseBook.pairStudents()
  console.log(courseBook.getPairs())

  console.log('-------------------------------------------')
  courseBook.addCourse('Odd Course')
  courseBook.selectCourse(1)
  courseBook.addStudent('A')
  courseBook.addStudent('B')
  courseBook.addStudent('C')
  courseBook.addStudent('D')
  courseBook.addStudent('E')

  console.log(courseBook.getCourse(1));

  courseBook.randomizeStudents() // Randomize students in the current course
  console.log(courseBook.getStudents())
  courseBook.pairStudents()
  console.log(courseBook.getPairs())
  console.log('-------------------------------------------')
  console.log(courseBook.studentCount())
  console.log("Student count:", courseBook.studentCount());
  let count = courseBook.studentCount()
  for (let i = 0; i < count; i++) {
    console.log(courseBook.pickStudent(i))
  }
  */
  // console.log(courseBook)


  (function() {
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

    $('body').on('click', '#pick-random-student', function(e) {
      const student = courseBook.nextStudent()
      console.log(student)
      if (student) {
        $("#random-student").html(student)
      } else {
        courseBook.randomizeStudents()
        $("#random-student").html('All students picked')
      }
    })

    $('body').on('click', '.select-course', function(e) {
      const courseIndex = Number($(this).data('course'))
      courseBook.selectCourse(courseIndex)
      refresh()
      $("#random-student").html("?")
    })

    $('body').on('click', '#delete-current-course', function(e) {
      const courseName = courseBook.getCurrentCourseName()
      let shouldDelete = confirm(`Are you sure you want to delete ${courseName}`)

      if (shouldDelete) {
        courseBook.deleteCurrentCourse()
      }

      courseBook.selectCourse(courseIndex)
      refresh()
      $("#random-student").html("?")
    })

    $('body').on('click', '#delete-current-student', function(e) {
      const studentName = courseBook.getCurrentCourseName()
      let shouldDelete = confirm(`Are you sure you want to delete ${studentName}`)

      if (shouldDelete) {
        courseBook.deleteCurrentStudent()
      }

      refresh()
      $("#random-student").html("?")
    })

    $('body').on('click', '#pick-pairs', function(e) {
      courseBook.pairStudents()
      showPairs()
    })

    $('body').on('submit', '#add-new-course', function(e){
      e.preventDefault()
      const newCourseName = $('#new-course-name').val()
      if (newCourseName.length > 0) {
        courseBook.addCourse(newCourseName)
        $('#new-course-name').val()
        refresh()
      }
    })

    $('body').on('submit', '#add-new-student', function(e){
      e.preventDefault()
      const newStudentName = $('#new-student-name').val()
      if (newStudentName.length > 0) {
        courseBook.addStudent(newStudentName)
        $('#new-student-name').val("")
        refresh()
      }
    })

  })()
