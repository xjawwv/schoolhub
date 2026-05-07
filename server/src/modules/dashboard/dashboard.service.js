const prisma = require('../../config/database')

const getAdminStats = async () => {
  const [totalStudents, totalTeachers, totalClasses, totalSubjects, recentAnnouncements, todayAttendance] = await Promise.all([
    prisma.students.count(),
    prisma.teachers.count(),
    prisma.classes.count(),
    prisma.subjects.count(),
    prisma.announcements.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
      take: 5,
    }),
    prisma.attendance.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ])

  return {
    totalStudents,
    totalTeachers,
    totalClasses,
    totalSubjects,
    todayAttendance,
    recentAnnouncements,
  }
}

const getGuruStats = async (userId) => {
  const teacher = await prisma.teachers.findUnique({ where: { user_id: userId } })
  if (!teacher) throw { statusCode: 404, message: 'Profil guru tidak ditemukan' }

  const [totalSchedules, totalSubjects, recentAttendance] = await Promise.all([
    prisma.schedules.count({ where: { teacher_id: teacher.id } }),
    prisma.subjects.count({ where: { teacher_id: teacher.id } }),
    prisma.attendance.findMany({
      where: { teacher_id: teacher.id },
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        class: { select: { id: true, name: true } },
        _count: { select: { details: true } },
      },
    }),
  ])

  return {
    teacherName: teacher.full_name,
    totalSchedules,
    totalSubjects,
    recentAttendance,
  }
}

const getSiswaStats = async (userId) => {
  const student = await prisma.students.findUnique({
    where: { user_id: userId },
    include: { class: { select: { id: true, name: true, grade: true } } },
  })

  if (!student) throw { statusCode: 404, message: 'Profil siswa tidak ditemukan' }

  const [totalGrades, attendanceSummary, recentAnnouncements] = await Promise.all([
    prisma.grades.count({ where: { student_id: student.id } }),
    prisma.attendance_details.groupBy({
      by: ['status'],
      where: { student_id: student.id },
      _count: { status: true },
    }),
    prisma.announcements.findMany({
      where: {
        is_active: true,
        OR: [{ target_role: 'SISWA' }, { target_role: null }],
      },
      orderBy: { created_at: 'desc' },
      take: 5,
    }),
  ])

  return {
    studentName: student.full_name,
    nis: student.nis,
    class: student.class,
    totalGrades,
    attendanceSummary,
    recentAnnouncements,
  }
}

module.exports = { getAdminStats, getGuruStats, getSiswaStats }
