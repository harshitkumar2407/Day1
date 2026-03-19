const followModel = require('../models/follow.model')
const userModel = require('../models/user.model')

async function followUserController(req,res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    // You con't follow your self
    if (followeeUsername === followerUsername) {
        return res.status(400).json({
            message:"you cannot follow yourself"
        })
    }
    
    // is the user exist you want to follow
    const isFolloweeExist = await userModel.findOne({
        username:followeeUsername
    })
    if (!isFolloweeExist) {
        return res.status(404).json({
            message: "User you are trying does not exist"
        })
    }

    //is user already following him 
    const isAlreadyFollowing = await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })
    if (isAlreadyFollowing) {
        return res.status(200).json({
            message:`You are already following ${followeeUsername}`
        })
    }
    
    
    // Update the the following record
    const followRecord = await followModel.create({
        follower:followerUsername,
        followee:followeeUsername,
        status:"pending"
    })

    res.status(201).json({
        message:`Follow request is send on ${followeeUsername}`,
        follow: followRecord
    })
}



async function unfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername,
    })

    if (!isUserFollowing) {
        return res.status(200).json({
            message:"you are not following this user"
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message:`You have unfollowed ${followeeUsername}`
    })

}

async function getFollowerListController(req,res) {
    const username = req.user.username;

    const followerList = await followModel.find({follower:username})

    res.status(200).json({
        message:`List of the follower of ${username}`,
        followers: followerList
    });
}

async function getFollowingListController(req,res) {
    const username = req.user.username;

    const followerList = await followModel.find({followee:username})

    res.status(200).json({
        message:`List of people ${username} is following`,
        following: followerList
    });
}

async function acceptRequest (req, res) {
    const followerUsername = req.params.username
    const followeeUsername = req.user.username

    const request = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(!request){
        return res.status(404).json({
            message: "follow request not found"
        })
    }

    if(request.status === "accepted"){
        return res.status(400).json({
            message:"Requested already accepted"
        })
    }

    request.status = "accepted"
    await request.save()

    res.status(200).json({
        message:"Follow requested accepted ",
        request
    })

}

module.exports = {
    followUserController,
    unfollowUserController,
    getFollowerListController,
    getFollowingListController,
    acceptRequest,
    
}