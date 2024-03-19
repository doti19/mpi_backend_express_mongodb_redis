const {Course} = require('../models');
const { APIError } = require('../../errors/apiError');
const {courseJoiValidator} = require('../../validators');
const {courseTransformer} = require('../../transformers');
const APIFeatures = require('../../utils/apiFeatures');
const { UserCourses } = require('../models/user.course.model');

const createCourse = async(courseData)=>{
    courseJoiValidator.createCourseValidator(courseData);
    prevCourses = Course.countDocuments();
    if(prevCourses === 0){
        courseData.starterCourse = true;
    }
    const course = await Course.create(courseData);
   
    return course;
}

const getAllCourses = async(query)=>{
    const features = new APIFeatures(Course.find(), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const courses = await features.query;
    return {result: courses.length, courses};
}

const publishCourse = async(courseId)=>{
    const course = await Course.findById(courseId);
    if(!course){
        throw new APIError({message: 'Course not found', status: 404});
    }
    // if(course.isPublished){
    //     throw new APIError({message: 'Course already published', status: 400});
    // }
    const courses = await Course.countDocuments();
    if((courses>1 && !course.prevCourse) && !course.startingCourse ){
        throw new APIError({message: 'Course must have a previous  course', status: 400});
    }
    if(course.prevCourse){
        
        const prevCourse = await Course.findById({
            _id: course.prevCourse,
        });

        if(prevCourse && prevCourse.nextCourse.toString()!==course.id){
            if(prevCourse.isPublished === false){
            throw new APIError({message: 'Previous course not published', status: 400});
        }else if(prevCourse.nextCourse){
            const nextCourse = await Course.findById({
                _id: prevCourse.nextCourse,
            });
            
            if(nextCourse){
            if(nextCourse.prevCourse.toString() !==prevCourse.id){
                throw new APIError({message: 'Next course not linked to previous course', status: 400});
            }else if(course.nextCourse){
                const coursenextCourse = await Course.findById({
                    _id: course.nextCourse,
                });
                if(coursenextCourse){
                    throw new APIError({message: 'Next course already linked to another course', status: 400});
                }else{
                    course.nextCourse = nextCourse.id;
                    nextCourse.prevCourse = course.id;
                    await nextCourse.save();
                }
            }else if(!course.nextCourse){
                course.nextCourse = nextCourse.id;
                nextCourse.prevCourse = course.id;
                await nextCourse.save();
            }
            }
        }
            course.prevCourse= prevCourse.id;
            prevCourse.nextCourse = course.id;
            prevCourse.lastUpdated = Date.now();
            await prevCourse.save();
        }else if(prevCourse && prevCourse.nextCourse.toString()===course.id){}
        else{
            course.prevCourse = null;
        }
    } 
    if(course.nextCourse){
        const nextCourse = await Course.findById({
            _id: course.nextCourse,
        });
        if(nextCourse && nextCourse.prevCourse.toString() !== course.id){
            if(nextCourse.prevCourse){
                const prevCourse = await Course.findById({
                    _id:nextCourse.prevCourse,
                });
                if(prevCourse){
                    if(prevCourse.nextCourse.toString() !== nextCourse.id){
                        throw new APIError({message: 'Previous course not linked to next course', status: 400});
                    }else if(prevCourse.isPublished == false){
                        throw new APIError({message: 'Previous course not published', status: 400});
                    }else if(course.prevCourse){
                        const courseprevCourse = await Course.findById({
                            _id: course.prevCourse,
                        });
                        if(courseprevCourse){
                            throw new APIError({message: 'Previous course already linked to another course', status: 400});
                        }else{
                            course.prevCourse = prevCourse.id;
                            prevCourse.nextCourse = course.id;
                            await prevCourse.save();
                        }
                }else if(!course.prevCourse){
                    course.prevCourse = prevCourse.id;
                    prevCourse.nextCourse = course.id;
                    await prevCourse.save();
                
                }
            }
        }
            course.nextCourse = nextCourse.id;
            nextCourse.prevCourse = course.id;
            await nextCourse.save();
        }else if(nextCourse && nextCourse.prevCourse.toString() === course.id){}
        else{
            course.nextCourse = null;
        }
    }


    course.isPublished = true;
    course.lastUpdated = Date.now();
    await course.save();
    return course;
}

const updateCoursePlan = async(courseId, courseData)=>{
    // basically what i am going to do here is that:
        // check if it is published=> throw an error
        // if the video has an assessment:
            //check if the assessment and video is valid
            // check if the video is not connected with assessment
            // check if the assessment is not connected with video:
                // if the video is not connected with assessment:
                    // connect the video with the assessment
                    // connect the assessment with the video
courseJoiValidator.updateCoursePlan(courseData);

    const course = await Course.findById(courseId.toString());
    if(!course){
        throw new APIError({message: 'Course not found', status: 404});
    }
    if(course.isPublished){
        throw new APIError({message: 'Course already published', status: 400});
    }
    
    const courseVideo = await course.videos.find(video=>video._id.toString()===courseData.videoId);
    if(!courseVideo){
        throw new APIError({message: 'Video not found', status: 404});
    }
    const courseAssessment = await course.assessments.find(assessment=>assessment._id.toString()===courseData.assessmentId);
    if(!courseAssessment){
        throw new APIError({message: 'Assessment not found', status: 404});
    }
    // check if it is connected with another courseAssessment, and update that one to null (connectedwith video => false and connected video id=> null)
    if(courseVideo.hasAssessmentNext){
        console.log('it has assessment next')
            const nextAssessment = await course.assessments.find(assessment=>assessment._id.toString()===courseVideo.assessmentId.toString());
           
            if(nextAssessment){
                console.log('it has next assessment', nextAssessment._id);
                nextAssessment.connectedWithVideo = false;
                nextAssessment.connectedVideoId = null;
                
                
            }
        
    }

    if(courseAssessment.connectedWithVideo){
        console.log('it has connected with video')
        const nextVideo = await course.videos.find(video=>video._id.toString()===courseAssessment.connectedVideoId.toString());
        
        if(nextVideo){
            console.log('it has next video', nextVideo._id);
            nextVideo.hasAssessmentNext = false;
            nextVideo.assessmentId = null;
            
           
            
        }
    }

    //now both video and assessment are not connected with any other video or assessment
    courseVideo.hasAssessmentNext = true;
    courseVideo.assessmentId = courseAssessment._id;
    courseAssessment.connectedWithVideo = true;
    courseAssessment.connectedVideoId = courseVideo._id;
    course.lastUpdated = Date.now();
    await course.save();
   return course;

    // TODO, update the course update on user course to first navigate to assessment and unlock it, then after finish assessment it unlocks the next video on the array
}

const updateCourse = async(courseId, courseData)=>{

    courseJoiValidator.updateCourseValidator(courseData);
  
    const course = await Course.findById(courseId);
    if(!course){
        throw new APIError({message: 'Course not found', status: 404});
    }

    if(courseData.prevCourse){
        const prevCourse = await Course.findById(courseData.prevCourse);
        if(prevCourse) {
            if(prevCourse.nextCourse){
            if(prevCourse.nextCourse.toString()!==course.id){   
            // if(prevCourse.published !== course.isPublished){
            //     throw new APIError({message: 'all courses need to be in the same state', status: 400});
            // }
            
                const nextCourse = await Course.findById({
                    _id: prevCourse.nextCourse,
                });
                
                if(nextCourse){
                if(nextCourse.prevCourse.toString() !==prevCourse.id){
                    throw new APIError({message: 'Next course not linked to previous course', status: 400});
                }
                // else if(nextCourse.isPublished !== course.isPublished){
                //     throw new APIError({message: 'all courses need to be in the same state', status: 400});
                // }
                else if(course.nextCourse){
                    const coursenextCourse = await Course.findById({
                        _id: course.nextCourse,
                    });
                    if(coursenextCourse){
                        throw new APIError({message: 'Next course already linked to another course', status: 400});
                    }else{
                        course.nextCourse = nextCourse.id;
                        nextCourse.prevCourse = course.id;
                        nextCourse.lastUpdated = Date.now();
                        await nextCourse.save();
                    }
                }else if(!course.nextCourse){
                    course.nextCourse = nextCourse.id;
                    nextCourse.prevCourse = course.id;
                    nextCourse.lastUpdated = Date.now();
                    await nextCourse.save();
                }
                }
            
                course.prevCourse= prevCourse.id;
                prevCourse.nextCourse = course.id;
                prevCourse.lastUpdated = Date.now();
                await prevCourse.save();
            }else{}
        }else{
            course.prevCourse= prevCourse.id;

            prevCourse.nextCourse = course.id;
            prevCourse.lastUpdated = Date.now();
            await prevCourse.save();
        }
        }else{
                course.prevCourse = null;
            }
        }
            if(courseData.nextCourse){
                const nextCourse = await Course.findById({
                    _id: courseData.nextCourse,
                });
                if(nextCourse && nextCourse.prevCourse.toString() !== course.id){
                //    if(nextCourse.isPublished!==course.isPublished){
                //           throw new APIError({message: 'all courses need to be in the same state', status: 400});
                //    }else 
                   if(nextCourse.prevCourse){
                        const prevCourse = await Course.findById({
                            _id:nextCourse.prevCourse,
                        });
                        if(prevCourse){
                            if(prevCourse.nextCourse.toString() !== nextCourse.id){
                                throw new APIError({message: 'Previous course not linked to next course', status: 400});
                            }
                            // else if(prevCourse.isPublished !== course.isPublished){
                            //     throw new APIError({message: 'all courses need to be in the same state', status: 400});
                            // }
                            else if(course.prevCourse){
                                const courseprevCourse = await Course.findById({
                                    _id: course.prevCourse,
                                });
                                if(courseprevCourse){
                                    throw new APIError({message: 'Previous course already linked to another course', status: 400});
                                }else{
                                    course.prevCourse = prevCourse.id;
                                    prevCourse.nextCourse = course.id;
                                    prevCourse.lastUpdated = Date.now();
                                    await prevCourse.save();
                                }
                        }else if(!course.prevCourse){
                            course.prevCourse = prevCourse.id;
                            prevCourse.nextCourse = course.id;
                            prevCourse.lastUpdated = Date.now();
                            await prevCourse.save();
                        
                        }
                    }
                }
                    course.nextCourse = nextCourse.id;
                    nextCourse.prevCourse = course.id;
                    nextCourse.lastUpdated = Date.now();
                    await nextCourse.save();
                }else if(nextCourse && nextCourse.prevCourse.toString() === course.id){}
                else{
                    course.nextCourse = null;
                }
            } 
    // 
    if(courseData.videos){
        courseData.videos.forEach(video=>{
            course.videos.push(video);
        });
    }
    if(courseData.assessments){
        courseData.assessments.forEach(assessment=>{
            course.assessments.push(assessment);
        });
    }
    if(courseData.externalResources){
        courseData.externalResources.forEach(externalResource=>{
            course.externalResources.push(externalResource);
        });
    }
    if(courseData.startingCourse){
        const course = Course.exists({startingCourse: true});
        if(course){
            delete courseData.startingCourse;
        }
    }
    delete courseData.prevCourse;
    delete courseData.nextCourse;
    delete courseData.isPublished;
    delete courseData.lastUpdated;
    delete courseData.createdAt;
    delete courseData.updatedAt;
    delete courseData.deleted;
    delete courseData.assessments;
    delete courseData.videos;
    delete courseData.externalResources;
    course.lastUpdated = Date.now();
    course.set(courseData);
    course.save();
    // const course = await Course.findByIdAndUpdate(courseId, {$push:{videos: video}, $push:{assessments: assessment}}, {new: true, runValidators: true});
    return {course: course};
    
}


const deleteCourse = async(courseId)=>{
    const course = await Course.findById(courseId);
    if(!course){
        throw new APIError({message: 'Course not found', status: 404});
    }
    
    if(course.isPublished==true){
        throw new APIError({message: 'Course already published', status: 400});
    }
    if(course.StartingCourse){
            if(course.nextCourse){
        const nextCourse = await Course.findById(course.nextCourse);
        if(nextCourse){
            nextCourse.startingCourse = true;
            nextCourse.prevCourse = null;
            nextCourse.lastUpdated = Date.now();
            await nextCourse.save();
        }
    }
}
    else if(course.prevCourse || course.nextCourse){
        if(course.prevCourse){
        const prevCourse = await Course.findById(course.prevCourse);
        if(prevCourse){
            if(course.nextCourse){
                const nextCourse = await Course.findById(course.nextCourse);
                if(nextCourse){
                    nextCourse.prevCourse = prevCourse.id;
                    prevCourse.nextCourse = nextCourse.id;
                    prevCourse.lastUpdated = Date.now();
                    await prevCourse.save();
                    nextCourse.lastUpdated = Date.now();
                    await nextCourse.save();
                }else{
                    prevCourse.nextCourse = null;
                    prevCourse.lastUpdated = Date.now();
                    await prevCourse.save();
                }
            }
        }
    }else if(course.nextCourse){
        const nextCourse = await Course.findById(course.nextCourse);
        if(nextCourse){
            nextCourse.prevCourse = null;
            nextCourse.lastUpdated = Date.now();
            await nextCourse.save();
    }
}
}

    // await Course.findByIdAndDelete(courseId);
    return {isPublished: course.isPublished, message: 'Course deleted successfully'};
}

const getCourse = async(courseId)=>{
    const course = await Course.findById(courseId);
    if(!course){
        throw new APIError({message: 'Course not found', status: 404});
    }
    return course;
}

module.exports = {
    createCourse,
    getAllCourses,
    publishCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    updateCoursePlan,
};
