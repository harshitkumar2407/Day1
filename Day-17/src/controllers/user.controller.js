const followModel = require('../models/follow.model')
const userModel = require('../models/user.model')

async function followUserController(req,res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const followRecord = await followModel.create({
        follower:followerUsername,
        followee:followeeUsername
    })
    if (followeeUsername === followerUsername) {
        return res.status(400).json({
            message:"you cannot follow yourself"
        })
    }

    const isFolloweeExist = await userModel.findOne({
        username:followeeUsername
    })

    if (!isFolloweeExist) {
        return res.status(404).json({
            message: "User you are trying does not exist"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

    if (isAlreadyFollowing) {
        return res.status(200).json({
            message:`You are already following ${followeeUsername}`
        })
    }



    res.status(201).json({
        message:`You are now following ${followeeUsername}`,
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
module.exports = {
    followUserController,
    unfollowUserController
}