const { Course, UsersCourse } = require('../api/models');
const { UserCourse } = require('../api/models/user.course.model');
const {APIError}=require('../errors/apiError')
async function addCoursesToPlayer(id){
    const userCourses = new UsersCourse.UserCourses({userId: id, courses: []});
    const courses = await Course.find({isPublished: true})
    if(courses.length===0){
        throw new APIError({message: "No courses found", status: 404});
    }
            for(let i =0; i<courses.length;i++){
                const course = courses[i];
                const userCourse = new UsersCourse.UserCourse({courseId: course.id, 
                    startingDate: Date.now(), 
                    status: i===0?'not started': 'locked',
                    videos: [],
                    assessments: []});
                    // for(let j=0;j<course.curriculum.length;j++){
                    //     const module = course.curriculum[j];
                    //     const userModule = new UsersCourse.UserModule({
                    //         moduleId: module.id,
                    //         status: j===0?'unlocked': 'locked'});
                    //         userCourse.curriculum.push(userModule);
                    // }
                    for(let j=0; j<course.videos.length;j++){
                        const video = course.videos[j];
                        const userVideo = new UsersCourse.UserVideo({
                            videoId: video._id, 
                            status: j===0?'new': 'locked'});
                            userCourse.videos.push(userVideo);
                    }
                    for(let j=0; j<course.assessments.length;j++){
                        const assessment = course.assessments[j];
                        const userAssessment = new UsersCourse.UserAssessment({
                            assessmentId: assessment._id, 
                            status: j===0?'unlocked': 'locked'});
                            userCourse.assessments.push(userAssessment);
                        }
                        
                userCourses.courses.push(userCourse);
            }
            console.log('userCourse', userCourses.courses)
            const res = await userCourses.save();
            return {courses: res};
            // newUser.courses = courses.map(course=>course.id);
            // newUser.save();
    
    
}

async function addCourseToPlayer(id, course){
    const userCourses = await UsersCourse.UserCourses.findOne({userId: id});
    if(!userCourses){
        throw new APIError({message: "User not found", status: 404});
    }
    // const previousCoursse = userCourses.courses.find((userCourse)=>userCourse.courseId.toString()==course.id);
    // prevCourse = UserCourse.Course.findOneById(course.prevCourse);
    const prevCourse = userCourses.courses.find((userCourse)=>userCourse.courseId.toString()==course.prevCourse);
    const courseStatus = course.prevCourse&& course.prevCourse!=='finished'? 'locked': 'not started';
    const userCourse = new UsersCourse.UserCourse({courseId: course.id, 
        startingDate: Date.now(), 
        status: courseStatus,
        videos: [],
        assessments: []});
        // for(let j=0;j<course.curriculum.length;j++){
        //     const module = course.curriculum[j];
        //     const userModule = new UsersCourse.UserModule({
        //         moduleId: module.id,
        //         status: j===0?'unlocked': 'locked'});
        //         userCourse.curriculum.push(userModule);
        // }
        for(let j=0; j<course.videos.length;j++){
            const video = course.videos[j];
            const userVideo = new UsersCourse.UserVideo({
                videoId: video._id, 
                status: (j===0 && courseStatus!=='locked')?'new': 'locked'});
                userCourse.videos.push(userVideo);
        }
        for(let j=0; j<course.assessments.length;j++){
            const assessment = course.assessments[j];
            const userAssessment = new UsersCourse.UserAssessment({
                assessmentId: assessment._id, 
                status: (j===0 && courseStatus!=='locked')?'unlocked': 'locked'});
                userCourse.assessments.push(userAssessment);
            }
            
    userCourses.courses.push(userCourse);
    
   const courses = await userCourses.save();

    // newUser.courses = courses.map(course=>course.id);
    // newUser.save();

}
// async function addPublishedCourseToAllUsers
async function updateAllUserCourses(courseId, userCourses){

}

async function checkCourseUpdated(courseId, userCourses){
    const course = await Course.findById(courseId);
    if(
        course.isPublished &&
        course.lastUpdated > userCourses.lastChecked
    ){
        return true;
    }else{
        return false;
    }
    

}
module.exports = {
    addCoursesToPlayer,
    updateCourse: updateAllUserCourses,
    checkCourseUpdated,
    addCourseToPlayer,
}