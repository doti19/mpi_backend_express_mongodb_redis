const { User: UserSchema, Invitation, UsersCourse,Friendship, Course } = require("../models");
const User = UserSchema.User;
const Parent = UserSchema.Parent;
const Player = UserSchema.Player;
const Coach = UserSchema.Coach;
const { APIError } = require("../../errors/apiError");
const { userTransformer, modelTransformer } = require("../../transformers");
const { userJoiValidator, courseJoiValidator } = require("../../validators");
const APIFeatures = require("../../utils/apiFeatures");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { bcrypt: bcryptConfig, links, server, token: tokenConfig } = require("../../config/config");

const sendEmail = require("../../config/email");

const { checkError } = require("../../utils/checkError");
const {addCourseToPlayer, addCoursesToPlayer} = require('../../helpers/course.helper');
const { status } = require("../../validators/helpers/fields/group.fields");
const { lastName } = require("../../validators/helpers/fields/user.fields");
const updateProfile = async (user, body) => {
    try {
        userJoiValidator.updateProfileValidator(body);
    } catch (err) {
        throw new Error(err);
    }
    const transformedBody = userTransformer.userUpdateBodyTransformer(body);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            {
                _id: user._id,
            },
            transformedBody,
            { new: true }
        );
        return updatedUser;
    } catch (err) {
        throw new Error(err);
    }
};

const deleteProfile = async (user) => {
    try {
        const role = user.role;
        if (role == "parent") {
            if(user.children.length>0){
                for (const childId of user.children) {
                    await Player.findByIdAndUpdate(childId, { $pull: { parents: user.id } });
                }
            }
        }else if(role == "coach"){
            if(user.players.length>0){
                for (const playerId of user.players) {
                    await Player.findByIdAndUpdate(playerId, { $pull: { coaches: user.id } });
                }
            }
        }else if(role=="player"){
            if(user.coaches.length>0){
                for (const coachId of user.coaches) {
                    await Coach.findByIdAndUpdate(coachId, { $pull: { players: user.id } });
                }
            }
            if(user.parents.length>0){
                for (const parentId of user.parents) {
                    await Parent.findByIdAndUpdate(parentId, { $pull: { children: user.id } });
                }
            }
            await UsersCourse.UserCourses.deleteMany({ userId: user._id });

        }
        const deletedUser = await User.findByIdAndDelete({ _id: user._id });

        return { message: "User deleted successfully" };
    
 } catch (err) {
        throw new APIError({
            message: "Error deleting User",
            status: 501,
            stack: err.stack,
        });
    }
};

const searchUsers = async (query) => {
    // try{
    //     userJoiValidator.searchUserValidator(query);
    // }catch(err){
    //     throw new Error(err);
    // }
    // const transformedQuery = userTransformer.searchUserQueryTransformer(query);
    try {
        // const users = await User.find(transformedQuery);
        const apiFeatures = new APIFeatures(Player.find(), query).search();
        const users = await apiFeatures.query;
        return { result: users.length, users };
    } catch (err) {
        throw new APIError({
            message: "Error searching for User",
            status: 501,
            stack: err.stack,
        });
    }
};

const inviteUser = async(body, user)=>{
    try{
            userJoiValidator.inviteUserValidator(body);
        }catch(err){
            throw new Error(err);
        }
        const {email, relationship} = body;
        try{
            // const Model = modelTransformer.convertModel(user.role);
            let message = '';
            let link = '';
    if(relationship=='parent' || relationship=='coach' || relationship=='child' || relationship=='player'){

    
        //const if the user is a player
        if(user.role=='player' ){
            // the player is adding a parent
            //check if he has 2 parents
            // if not send the link
            // also send the coach a link too, if he wants to add a coach
            if(relationship=='parent'){
            if(user.parents.length==2){
                throw new Error("You cannot have more than 2 parents");
            }
            const parent = await Parent.findOne({"emailAddress.email": email});
            // if there is a parent, send the link to api/v1/users/add
            if(parent){

                message = `Hello ${parent.firstName} ${parent.lastName}, ${user.firstName} ${user.lastName} has invited you to be their parent and support through their journey.\n Please click the link below to accept the invitation.`
                link = `${links.baseUrl}${links.addUser}?rel=parent`;
            }else{
                //TODO, pronoun issue?
                message = `Hello How Do You do, ${user.firstName} ${user.lastName} has invited you to be their parent and support through their journey. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
                link = `${links.baseUrl}${links.signupUser}?rel=parent`;
            }
            // if there is no parent, send the link to auth/register

        } else if(relationship=='coach'){
            const coach = await Coach.findOne({"emailAddress.email": email});
            // if there is a coach, send the link to api/v1/users/add
            if(coach){
                message = `Hello ${coach.firstName} ${coach.lastName}, ${user.firstName} ${user.lastName} has invited you to be their coach and support through their journey.\n Please click the link below to accept the invitation.`
                link = `${links.baseUrl}${links.addUser}?rel=coach`;
        }else{
            message = `Hello How Do You do, ${user.firstName} ${user.lastName} has invited you to be their coach and support through their journey. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
            link = `${links.baseUrl}${links.signupUser}?rel=coach`;
        }
    }else{
        throw new Error("Invalid Relationship");
    }
    }
    // if the user is parent
    else if(user.role=='parent'){
        // check if the child has 2 parents
        // if not send the link
        if(relationship=='child'){
            const child = await Player.findOne({"emailAddress.email": email});
            if(child){

                if(child.parents.length==2){
                    throw new Error("The child already has 2 parents");
                }
                message = `Hello ${child.firstName} ${child.lastName}, ${user.firstName} ${user.lastName} has asked to become your guardian and support you in your journey.\n Please click the link below to accept the invitation.`
                link = `${links.baseUrl}${links.addUser}?rel=child`;
            }else{
                message = `Hello How Do You do, ${user.firstName} ${user.lastName} has asked to become your guardian and support you in your journey. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
                link = `${links.baseUrl}${links.signupUser}?rel=child`;
            }
        }
        else{
            throw new Error("Invalid Relationship");
        }
    }
    // if the user is coach
    else if(user.role=='coach'){
        // since we didnt enforce the number of players a coach can have
        // just send them the link
        if(relationship=='player'){
            const player = await Player.findOne({"emailAddress.email": email});
            if(player){
                message = `Hello ${player.firstName} ${player.lastName}, ${user.firstName} ${user.lastName} has invited you to be their player and support you through your journey.\n Please click the link below to accept the invitation.`
                link = `${links.baseUrl}${links.addUser}?rel=player`;
            }else{
                message = `Hello How Do You do, ${user.firstName} ${user.lastName} has invited you to be their player and support you through your journey. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
                link = `${links.baseUrl}${links.signupUser}?rel=player`;
            }
        }else{
            throw new Error("Invalid Relationship");
        
        }
    }else{
        throw new Error("Invalid Role");
    }
}else if (relationship=='join'){
    const user = await User.find({email: email});
    if(user){
        return {"message": "User already exists"};
    }
    message = `Hello How Do You do, ${user.firstName} ${user.lastName} has invited you to join the platform. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
    link = `${links.baseUrl}${links.signupUser}?rel=join`;
}else{
    throw new Error("Invalid Relationship");
}
    if(message && link){
        if(relationship=='join'){
            checkError(sendEmail({
                email: email,
                subject: "Invitation to join MPI",
                payload: {
                    message: message,
                    name: user.firstName,
                    link: `${link}`,
                },
                template: "invitation.handlebars",
            }));
            if(server.env !== "production"){
                return {link: link, email: email, message: message};
            }else{
                return {"message": "Invitation link"};
            
            }
        }else if(relationship=='parent' || relationship=='coach' || relationship=='child' || relationship=='player'){

        
            const resetToken = crypto.randomBytes(32).toString("hex");
            // const hash = await bcrypt.hash(resetToken, bcryptConfig.saltRounds);
            await Invitation.deleteMany({invitedEmail: email, rel: relationship, inviterId: user.id});
        const invitation = new Invitation({
            inviterId: user.id,
            invitedEmail: email,
            rel: relationship,
            token: resetToken,
        });
        await invitation.save();
            checkError(sendEmail({
                email: email,
                subject:  `Invitation from ${user.firstName}`,
                payload: {
                    message: message,
                    name: user.firstName,
                    link: `${link}&token=${resetToken}`,
                },
                template: "invitation.handlebars",
            }));
            if(server.env !== "production"){
                return {link: `${link}&token=${resetToken}`, email: email, token: resetToken, message: message};
            }else{
                return {"message": "Invitation link"};
            
            }
        }else{
            throw new Error("Error sending Invitation link");
        }
        }else{
            throw new Error("Error sending Invitation link");
        }
    }catch(err){
            console.log(err);
            throw new APIError({
                message: "Error sending Invitation link",
                status: 501,
                stack: err.stack,
            });
        }
}

const addUser = async(query, user)=>{
    try{
        userJoiValidator.addUserValidator(query);
    }catch(err){
        throw new Error(err);
    }
    try{
    const {rel, token} = query;
    if(rel=='join' || (rel!=='parent' && rel!=='coach' && rel!=='child' && rel!=='player')){
        throw new Error("Invalid Relationship");
    };
        
        const invitation = await Invitation.findOne({token: token, rel: rel, createdAt: { $gt: Date.now() - tokenConfig.invitationExpirationSeconds * 1000 },});
        if(!invitation){
            throw new Error("Invalid or expired invitation token");
        }
        if(invitation.rel !==rel || invitation.invitedEmail !== user.emailAddress.email){
            throw new Error("Invalid invitation link");
        }
    // now i have a valid invitation token...
    
    // if the invited is a parent, and the inviter is a child
    // first check if the user
    if(rel=='parent'){
        const child = await Player.findById(invitation.inviterId);
        if(!child){
            throw new Error("Invalid invitation");
        }
        if(child.parents.length>=2){
            throw new Error("The child already has 2 parents");
        }
        const parent = await Parent.findOne({"emailAddress.email": invitation.invitedEmail});
        if(!parent){
            throw new Error("Invalid invitation");
        }
        child.parents.push(parent.id);
        parent.children.push(child.id);
        await child.save();
        await parent.save();
        await invitation.deleteOne();
        
        return {message: "child added successfully"};

    }
    // if the invited is a player, and inviter is a coach
    else if(rel=='player'){
        const coach = await Coach.findById(invitation.inviterId);
        if(!coach){
            throw new Error("Invalid invitation");
        }
        const player = await Player.findOne({"emailAddress.email": invitation.invitedEmail});
        if(!player){
            throw new Error("Invalid invitation");
        }
        coach.players.push(player.id);
        player.coaches.push(coach.id);
        await coach.save();
        await player.save();
        await invitation.deleteOne();
        return {message: "Coach added successfully"};
    }
    // if the invited is a coach, and inviter is a player
    else if(rel=='coach'){
        const player = await Player.findById(invitation.inviterId);
        if(!player){
            throw new Error("Invalid invitation");
        }
        const coach = await Coach.findOne({"emailAddress.email": invitation.invitedEmail});
        if(!coach){
            throw new Error("Invalid invitation");
        }
        player.coaches.push(coach.id);
        coach.players.push(player.id);
        await player.save();
        await coach.save();
        await invitation.deleteOne();
        return {message: "Player added successfully"};
    }
    // if the invited is a player, and inviter is a parent
    else if(rel=='child'){
        const parent = await Parent.findById(invitation.inviterId);
        if(!parent){
            throw new Error("Invalid invitation");
        }
        const child = await Player.findOne({"emailAddress.email": invitation.invitedEmail});
        if(!child){
            throw new Error("Invalid invitation");
        }
        if(child.parents.length>=2){
            throw new Error("The child already has 2 parents");
        }
        parent.children.push(child.id);
        child.parents.push(parent.id);
        await parent.save();
        await child.save();
        await invitation.deleteOne();
        return {message: "Parent added successfully"};

    }
}catch(err){
    throw new APIError({
        message: "Error adding User",
        status: 501,
        stack: err.stack,
    });
}
}

const canView = async(callback, user, options)=>{
    try{
        const Model = modelTransformer.convertModel(user.role);
        const model = await Model.findById(user.id);
        if(!model){
            throw new Error("User not found");
        };
        const {id, query} = options;
        if(user.role=='coach'){
            if(model.players.length>0){
                const players = await Player.find({_id: { $in: model.players}});
                if(!players){
                    throw new Error('you dont have any players with that id');
                }
                return callback(id, query);
            }else{
                throw new Error('you dont have any players');
            }
        }else if (user.role=='parent'){
            if(model.children.length>0){
                const children = await Player.find({_id: { $in: model.children}});
                if(!children){
                    throw new Error('you dont have any children with that id');
                }
                return callback(id, query);
            }else{
                throw new Error('you dont have any children registered');
            }
        }else{
            throw new APIError({message: 'unauthorized', status: 401});
        }
    }catch(err){
        throw new APIError({
            message: "Error viewing Player Courses",
            status: 501,
            stack: err.stack,
        });
    }
}

const viewPlayerCourses= async (id, query)=>{
    try{
        
        const myCourse = await UsersCourse.UserCourses.findOne({userId: id});
        if(!myCourse){
            await addCoursesToPlayer(id);
        }else{

        
          
            const updatedCourses = await Course.find({$and:[{isPublished: true, lastUpdated: { $gt: myCourse.lastChecked  },}]} );
            console.log(updatedCourses.length)
            if(updatedCourses.length>0){
                for (const course of updatedCourses) {
                    const userCourses = await UsersCourse.UserCourses.findOne({userId: id, courses:{$elemMatch: {courseId: course.id}}});
                    if(!userCourses && course.isPublished==true){

                       await addCourseToPlayer(id, course);
                       continue;
                    } ;
                    const userCourse = userCourses.courses.find((userCourse)=>userCourse.courseId.toString()==course.id);
                    
                    if(userCourse){
                        if(course.isPublished==false){
                            userCourse.canView = false;
                        }
                        for(let i=0; i<course.videos.length; i++){
                            const video = course.videos[i];
                            const userVideo = userCourse.videos.find((userVideo)=>userVideo.videoId.toString()==video._id.toString());
                           
                            if(!userVideo){
                                const previousStatus = userCourse.videos.length>0? userCourse.videos[userCourse.videos.length-1].status: -1;
                                const status = (userCourse.status=="locked" || (previousStatus>-1 && userCourse.videos[previousStatus].status=="locked")) ? "locked": (previousStatus>-1 && userCourse.videos[previousStatus].status=="unfinished"?"locked":"new" );
    
                                userCourse.videos.push({videoId: video._id, status: status});
                            }else{
                                if(video.deleted){
                                    userCourse.videos = userCourse.videos.filter((userVideo)=>userVideo.videoId.toString()!=video._id.toString());
    
                                }
                            }
                            
                        }
                        for(let i=0; i<course.assessments.length; i++){
                            const assessment = course.assessments[i];
                            const userAssessment = userCourse.assessments.find((userAssessment)=>userAssessment.assessmentId.toString()==assessment._id.toString());
                            if(!userAssessment){
                                const previousStatus = userCourse.assessments.length>0? userCourse.assessments[userCourse.assessments.length-1].status: -1;
                                const status = (userCourse.status=="locked" || (previousStatus>-1 && userCourse.assessments[previousStatus].status=="locked")) ? "locked": (previousStatus>-1 && userCourse.assessments[previousStatus].status=="unfinished"?"locked":"unlocked" );
                                userCourse.assessments.push({assessmentId: assessment._id, status: status});
                        }else{
                            if(assessment.deleted){
                                userCourse.assessments = userCourse.assessments.filter((userAssessment)=>userAssessment.assessmentId.toString()!=assessment._id.toString());
                            }
                        }
                        
                        
                    } 
                    // console.log('userCourse', userCourse.videos.length);
                    userCourses.lastChecked = Date.now();
                    await userCourses.save();
                    
                    }
                   
            }
        }
        // console.log('userCourse', myCourse.courses);
        return {course: myCourse.courses.filter((course)=>course.canView==true)};
    }
    }catch(err){
        console.log(err);
        throw new APIError({
            message: "Error viewing User Courses",
            status: 501,
            stack: err.stack,
        });
    }

}

const updateCourseVideoProgress = async(courseId, videoId, body, user)=>{
   
        courseJoiValidator.updateVideoUserCourseValidator(body);
   


    //TODO user should update based on user course id, not course id

    const userCourse = await UsersCourse.UserCourses.findOne({userId: user.id, courses:{$elemMatch: {courseId: courseId}}});
    if(!userCourse){
        throw new Error("Course not found");
    }

    const course = userCourse.courses.find((course)=>course.courseId.toString()==courseId);
    if(!course){
        throw new Error("Course not found");
    }
   
        //TODO why am i using video.videoId instead of video._id
        const video = course.videos.find((video)=>video.videoId.toString()==videoId);
        if(!video){
            throw new Error("Video not found");
        }
        if(video.status == "locked" || body.status =="new" || body.status=="locked"){
            throw new Error("You cannot unlock this video yet");
        }
        if(video.status=="finished"){
            // throw new Error("Video already finished");
        }
        const videoIndex = course.videos.indexOf(video);
        const isLastVideo = videoIndex === course.videos.length - 1;
        if(videoIndex>0){
            const previousVideo = course.videos[videoIndex-1];
            if(previousVideo.status!="finished"){
                video.status = "locked";
                await userCourse.save();
                throw new Error("You cannot unlock this video yet");
            }
        }
        
        if(body.status=="finished"){

            const courseModel = await Course.findById(courseId).select('videos assessments nextCourse');
            const courseVideo = await courseModel.videos.find(video => video._id.toString() === videoId);
            if(courseVideo.hasAssessmentNext){
                const nextAssessment = await courseModel.assessments.find(assessment => assessment._id.toString()===courseVideo.assessmentId.toString());
                if(nextAssessment){
                    const userAssessment = course.assessments.find((assessment)=>assessment.assessmentId.toString()==nextAssessment._id.toString());
                    if(userAssessment){
                        userAssessment.status = "unlocked";
                    }else{
                        throw new Error("Assessment not found");
                    }
                }
            }else{
                if(!isLastVideo && (videoIndex+1<=course.videos.length-1))
                    course.videos[videoIndex+1].status = "new";
            }
            if(isLastVideo){
                    course.videosFinished = true;
                if(course.videosFinished && (course.assessmentsFinished|| !courseVideo.hasAssessmentNext) ){
                    if(courseModel.nextCourse){

                    
                    const nextCourse = await Course.findById(courseModel.nextCourse);
                    if(!nextCourse || !nextCourse.isPublished){
                        throw new Error("Next Course not found");
                    }

                    const nextUserCourse = userCourse.courses.find((course)=>course.courseId.toString()==nextCourse._id.toString());
                    if(!nextUserCourse){
                       const courseId =  await addCourseToPlayer(user.id, nextCourse);
                        const nextUserCourse = await UsersCourse.UserCourses.findOne({userId: user.id, courses:{$elemMatch: {courseId: courseId}}});
                        if(!nextUserCourse){
                            throw new Error("Next Course not found");
                        }
                        nextUserCourse.startingDate= Date.now();
                        nextUserCourse.status = "unlocked";
                        nextCourse.videos[0].status = "new";
                        await nextUserCourse.save();
                    }else{
                        nextUserCourse.startingDate= Date.now();
                        nextUserCourse.status = "unlocked";
                        nextCourse.videos[0].status = "new";
                        await nextUserCourse.save();
                    }
                }

                course.status = "finished";
                }else{
                    course.status = "started";
                }
            }else{
                course.status = "started";
            }
        
            video.status = "finished";
        }else{
            video.status = body.status;
            course.status = "started"
        }
        await userCourse.save();

        // return {
        //     videoId: userCourse.courses[0].videos[0].videoId,
        //     status: userCourse.courses[0].videos[0].status,
        //     '==========': '------------------------',
        //     video1Id: userCourse.courses[0].videos[1].videoId,
        //     video1Status: userCourse.courses[0].videos[1].status,
        //     '========': '------------------------',
        //     userAssessment: userCourse.courses[0].assessments[0].assessmentId,
        //     userAssessmentStatus: userCourse.courses[0].assessments[0].status,
        //     '============': '------------------------',
        //     userAssessment1Id: userCourse.courses[0].assessments[1].assessmentId,
        //     userAssessment1Status: userCourse.courses[0].assessments[1].status,

        // };

        return {
            videoId: userCourse.courses[1].videos[0].videoId,
            status: userCourse.courses[1].videos[0].status,
            '==========': '------------------------',
            video1Id: userCourse.courses[1].videos[1].videoId,
            video1Status: userCourse.courses[1].videos[1].status,
            '========': '------------------------',
            userAssessment: userCourse.courses[1].assessments[0].assessmentId,
            userAssessmentStatus: userCourse.courses[1].assessments[0].status,
            '============': '------------------------',
            userAssessment1Id: userCourse.courses[1].assessments[1].assessmentId,
            userAssessment1Status: userCourse.courses[1].assessments[1].status,

        };
        // return userCourse;
       
    }

    // if(body.assessmentId){





const updateCourseAssessmentProgress = async(courseId, assessmentId, body, user)=>{
   
    courseJoiValidator.updateAssessmentUserCourseValidator(body);
    const userCourse = await UsersCourse.UserCourses.findOne({userId: user.id, courses:{$elemMatch: {courseId: courseId}}});

    if(!userCourse){
        throw new Error("Course not found");
    }
    const course = userCourse.courses.find((course)=>course.courseId.toString()==courseId);
    if(!course){
        throw new Error("Course not found");
    }
//TODO here also am using assessment.assessmentId, but for the future change it to assessment._id

    const assessment = course.assessments.find((assessment)=>assessment.assessmentId.toString()==assessmentId.toString());
    
    if(!assessment){
        throw new Error("Assessment not found");
    }
    if(assessment.status == "locked"){
        throw new Error("You cannot unlock this assessment yet");
    }
    if(assessment.status=="passed"){
        // throw new Error("Assessment already passed");
    }
    const assessmentIndex = course.assessments.indexOf(assessment);
    const isLastAssessment = assessmentIndex === course.assessments.length - 1;
    const courseModel = await Course.findById(courseId).select('videos assessments nextCourse');
    const courseAssessment = await courseModel.assessments.find(assessment => assessment._id.toString() === assessmentId);
    const courseQuestions = courseAssessment.questions;
    let undefinedCount = 0;
    let failureCount = 0;
    const updatedQuestions = assessment.questions.map(question => {
        const updatedQuestion = body.questions.find(q => q.questionId.toString() === question.questionId.toString());
       
        if (updatedQuestion) {
          // Update the fields of the question
        if(updatedQuestion.userAnswer){
            
            const courseQuestion = courseQuestions.find(q => q._id.toString() === question.questionId.toString());
            question.userAnswer = updatedQuestion.userAnswer;
            if(question.userAnswer == courseQuestion.correctAnswer){

            question.answerStatus = "correct";
        }else{
            question.answerStatus = "incorrect";
            failureCount++;
        }
    }
        }else{
            undefinedCount++;
        }
        return question;
      });
      if(undefinedCount==assessment.questions.length){
            throw new Error("No question was answered");
      }
      
      assessment.questions = updatedQuestions;
      const allQuestionsPassed = assessment.questions.every(question=>question.answerStatus=="correct");
console.log(allQuestionsPassed)
console.log(allQuestionsPassed && (failureCount==0) && assessment.status!=="locked" )
      if(allQuestionsPassed &&failureCount==0 && assessment.status!=="locked" ){
        assessment.status = "passed";
        if(courseAssessment.connectedWithVideo){
            const prevVideo = course.videos.find(video=> video.videoId.toString()==courseAssessment.connectedVideoId.toString());
            if(prevVideo){
                const videoIndex = course.videos.indexOf(prevVideo);
                const isLastVideo = videoIndex === course.videos.length-1;
                
                if(!isLastVideo && (videoIndex+1<=course.videos.length-1)){
                    course.videos[videoIndex+1].status = "new";
                }
                course.status == "started";
            }
        }
        if(isLastAssessment){
            course.assessmentsFinished = true;
            if(course.videosFinished && course.assessmentsFinished ){
               
                if(courseModel.nextCourse){
                const nextCourse = await Course.findById(courseModel.nextCourse);
                if(!nextCourse || !nextCourse.isPublished){
                    throw new Error("Next Course not found");
                }

                //TODO this one returned an array, now it is fixed but fix it on the videos part, it is the same code
                const course = userCourse.courses.find((course)=>course.courseId.toString()==courseId);

                const nextUserCourse = userCourse.courses.find((course)=>course.courseId.toString()==nextCourse._id.toString());
                console.log('my next course',nextUserCourse);
                if(!nextUserCourse){
                   const courseId =  await addCourseToPlayer(user.id, nextCourse);
                    const nextUserCourse = await UsersCourse.UserCourses.findOne({userId: user.id, courses:{$elemMatch: {courseId: courseId}}});
                    if(!nextUserCourse){
                        throw new Error("Next Course not found");
                    }
                    nextUserCourse.startingDate= Date.now();
                    nextUserCourse.status = "unlocked";
                    nextCourse.videos[0].status = "new";
                    // await nextUserCourse.save();
                }else{
                    console.log('bumbaye')
                    console.log(nextUserCourse);
                    nextUserCourse.startingDate= Date.now();
                    nextUserCourse.status = "unlocked";
                    nextUserCourse.videos[0].status = "new";
                    // console.log(nextCourse)
                    // await nextUserCourse.save();
                }
            course.status = "finished";
            }else{
                //congratulation u have finished the course
                //TODO do this for the video too
                throw new Error("Next Course not found");
            
            }
            }
        }
      }
      if(course.status=="not started") course.status="started";
        await userCourse.save();
       
     

    //Assessments state 'passed', 'failed', 'unlocked', 'locked'
    //Questions state 'answered', 'started', 'locked', 'not started
    // answer state 'correct', 'incorrect', 'unanswered'
    return {
        status: assessment.status,
        assessment: assessment.questions,
    }
   
}

const viewProfileDashboard= async(user)=>{
    try{
        const data = {};
        const userCourse = await UsersCourse.UserCourses.findOne({userId: user.id});
        data.courses = userCourse.length;
        data.assessmentsPassed = 0;
        data.assessmentsFailed = 0;
        data.videosFinished = 0;
        if(userCourse){
            const finishedCourses = userCourse.courses.filter((course)=>course.status=="finished");
            data.finishedCourses = finishedCourses.length;
            userCourse.courses.forEach((course)=>{
                course.assessments.forEach((assessment)=>{

                    if(assessment.status=='passed'){
                        data.assessmentsPassed++;
                    }else if(assessment.status=='failed'){
                        data.assessmentsFailed++;
                    }
                });
                course.videos.forEach((video)=>{
                    if(video.status=='finished'){
                        data.videosFinished++;
                    }
                })
                
            });
        }
        if(user.role=='player'){
            const player = await Player.findById(user.id);
            
            friends = await Friendship.countDocuments({$or:[{user1: user.id}, {user2: user.id}], status: "friends"});
            data.coaches = player.coaches.length;
            data.parents = player.parents.length;
            data.friends = friends;
        };
    
        return {
            course:{
                total: data.courses,
                finished: data.finishedCourses,
                assessments:{
                    passed: data.assessmentsPassed,
                    failed: data.assessmentsFailed,
                },
                videos:{
                    finished: data.videosFinished,
            }
        },
            userData: {
                name: user.firstName,
                role: user.role,
                email: user.emailAddress.email,
                phone: user.phoneNumber,
                address: user.address,
            },
            friends: data.friends,
            coaches: data.coaches,
            parents: data.parents,
            }
        
        
    }catch(err){
        throw new APIError({
            message: "Error viewing Profile Dashboard",
            status: 501,
            stack: err.stack,
        });
    }
}

const viewChildren = async(user)=>{
    try{
        const children = await Player.find({_id: { $in: user.children}}).select("firstName lastName phoneNumber avatar -__t");
        
        return children;
    }catch(err){
        throw new APIError({
            message: "Error viewing Children",
            status: 501,
            stack: err.stack,
        });
    }

}

const viewChild = async(id, user)=>{
    try{
        const child = await Player.findById(id).select("firstName lastName emailAddress.email phoneNumber avatar lastOnline parents coaches -__t");
        if(!child){
            throw new Error("Child not found");
        }
        if(!child.parents.includes(user.id)){
            throw new Error("Unauthorized");
        }
        return child;
    }catch(err){
        throw new APIError({
            message: "Error viewing Child",
            status: 501,
            stack: err.stack,
        });
    }
}

const viewChildCoaches = async(id, user)=>{
    try{
        const child = await Player.findById(id);
        if(!child){
            throw new Error("Child not found");
        }
        if(!child.parents.includes(user.id)){
            throw new Error("Unauthorized");
        }
        const coaches = await Coach.find({_id: { $in: child.coaches}}).select("firstName lastName avatar lastOnline ");
        return coaches;
    }catch(err){
        throw new APIError({
            message: "Error viewing Child Coaches",
            status: 501,
            stack: err.stack,
        });
    }
}

const viewChildCoach = async(id, coachId, user)=>{
    try{
        const child = await Player.findById(id);
        if(!child){
            throw new Error("Child not found");
        }
        if(!child.parents.includes(user.id)){
            throw new Error("Unauthorized");
        }
        const coach = await Coach.findById(coachId).select("firstName lastName emailAddress.email phoneNumber avatar lastOnline -__t");
        if(!coach){
            throw new Error("Coach not found");
        }
        if(!child.coaches.includes(coachId)){
            throw new Error("Unauthorized");
        }
        return coach;
    }catch(err){
        throw new APIError({
            message: "Error viewing Child Coach",
            status: 501,
            stack: err.stack,
        });
    }
}

const viewPlayers = async(user)=>{
    try{
        const players = await Player.find({_id: { $in: user.players}}).select("firstName lastName lastOnline parents coaches -__t");
        return players;
    }catch(err){
        throw new APIError({
            message: "Error viewing Players",
            status: 501,
            stack: err.stack,
        });
    }
}

const viewPlayer= async(id, user)=>{
    try{
        const player = await Player.findById(id).select("firstName lastName emailAddress.email phoneNumber avatar lastOnline parents coaches -__t");
        if(!player){
            throw new Error("Player not found");
        }
        if(!user.players.includes(id)){
            throw new Error("Unauthorized");
        }
        return player;
}catch(err){
    throw new APIError({
        message: "Error viewing Player",
        status: 501,
        stack: err.stack,
    });
}
}

const viewPlayerParents = async(id, user)=>{
    try{
        const player = await Player.findById(id);
        if(!player){
            throw new Error("Player not found");
        }
        if(!user.players.includes(id)){
            throw new Error("Unauthorized");
        }
        const parents = await Parent.find({_id: { $in: player.parents}}).select("firstName lastName avatar lastOnline -__t");
        return parents;
    }catch(err){
        throw new APIError({
            message: "Error viewing Player Parents",
            status: 501,
            stack: err.stack,
        });
    }
}

const viewPlayerParent = async(id, parentId, user)=>{
    try{
        const player = await Player.findById(id);
        if(!player){
            throw new Error("Player not found");
        }
        if(!user.players.includes(id)){
            throw new Error("Unauthorized");
        }
        const parent = await Parent.findById(parentId).select("firstName lastName emailAddress.email phoneNumber avatar lastOnline -__t");
        if(!parent){
            throw new Error("Parent not found");
        }
        if(!player.parents.includes(parentId)){
            throw new Error("Unauthorized");
        }
        return parent;
    }catch(err){
        throw new APIError({
            message: "Error viewing Player Parent",
            status: 501,
            stack: err.stack,
        });
    }
}

module.exports = {
    updateProfile,
    deleteProfile,
    searchUsers,
    inviteUser,
    addUser,
    viewPlayerCourses,
    updateCourseVideoProgress,
    updateCourseAssessmentProgress,
    canView,
    viewProfileDashboard,

    viewChildren,
    viewChild,
    viewChildCoaches,
    viewChildCoach,

    viewPlayers,
    viewPlayer,
    viewPlayerParents,
    viewPlayerParent,
};
