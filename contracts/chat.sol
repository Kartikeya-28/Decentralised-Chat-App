//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract chatDapp{

    struct post{ // structure of a message that a user can send
        uint like;
        uint heart;
        bool edited;
        uint id;
        uint time;
        address sender;
        string message;
    }

    struct emoji{
        bool like;
        bool heart;
    }

    struct adr_emoji{
        address _address;
        bool like;
        bool heart;
    }

    struct type_of_chat{
        address[] userFriend;
        address[] userGroup;
    }
    struct group{  // structure of a group 
        address _admin; // creator of the group (only has access to delete a group post)
        address _groupAddress; // unique address of the group generated when the group is created
    }
    uint public nonce = 0 ; // used while generating the hash of a group 

    mapping(address => mapping(address => post[])) internal _userChatFriends; // two person chats
            // you             //friend   //chats

    mapping(address => type_of_chat) internal _groupsandfriends; // list of groups that a user is a part of
            //user      //the various groups the user is part of

    mapping(address => group) internal _getGroup; // get a group from its unique address
            //unique   //group
            // address of a group     

    mapping(address => mapping(address => bool)) internal _isMember; // checks whether a user is a member of a group or not
            //groupAddress     //user

    mapping(address => mapping(address => mapping(uint => emoji))) internal _isLiked_Hearted;
    
    mapping(address => post[]) _groupPosts;

    mapping(address => mapping(uint => adr_emoji[])) internal _reactedUsers;

    // for verifying whether a user is sender of a post 
    modifier onlySender(address _user1) {
        require(msg.sender == _user1, "You are not the sender of this post");
        _;
    }

    // get a post between two people
    function getPost(address _user2,uint index) public view returns(post memory){
        return _userChatFriends[msg.sender][_user2][index];
    }

    // toogle a like emoji for a post between two people
    function likePostToggle(address _user2, uint _index) public{

        bool isLiked = _isLiked_Hearted[_user2][msg.sender][_index].like;

        if(isLiked == false){
            _isLiked_Hearted[_user2][msg.sender][_index].like = true;
            _userChatFriends[msg.sender][_user2][_index].like++;
            _userChatFriends[_user2][msg.sender][_index].like++;
            _reactedUsers[_user2][_index].push(adr_emoji(msg.sender,true,false));
            _reactedUsers[msg.sender][_index].push(adr_emoji(msg.sender,true,false));
        }
        else{
            _isLiked_Hearted[_user2][msg.sender][_index].like = false;
            _userChatFriends[msg.sender][_user2][_index].like--;
            _userChatFriends[_user2][msg.sender][_index].like--;
            for(uint i =0 ; i < _reactedUsers[_user2][_index].length ; i++){
                if(_reactedUsers[_user2][_index][i]._address == msg.sender && _reactedUsers[_user2][_index][i].like == true){
                    _reactedUsers[_user2][_index][i] = _reactedUsers[_user2][_index][_reactedUsers[_user2][_index].length-1];
                     _reactedUsers[msg.sender][_index][i] = _reactedUsers[msg.sender][_index][_reactedUsers[_user2][_index].length-1];
                     break;
                }
            }
            _reactedUsers[_user2][_index].pop();
            _reactedUsers[msg.sender][_index].pop();
        }

    }
    
    function getLike(address _user2, uint index) public view returns(bool){
        return (_isLiked_Hearted[_user2][msg.sender][index].like);
    }

    // toggle a heart emoji to a post between two people
    function heartPostToggle(address _user2, uint _index) public{

        bool isHearted = _isLiked_Hearted[_user2][msg.sender][_index].heart;

        if(isHearted == false){
            _isLiked_Hearted[_user2][msg.sender][_index].heart = true;
            _userChatFriends[msg.sender][_user2][_index].heart++;
            _userChatFriends[_user2][msg.sender][_index].heart++;
            _reactedUsers[_user2][_index].push(adr_emoji(msg.sender,false,true));
            _reactedUsers[msg.sender][_index].push(adr_emoji(msg.sender,false,true));
        }
        else{
            _isLiked_Hearted[_user2][msg.sender][_index].heart = false;
            _userChatFriends[msg.sender][_user2][_index].heart--;
            _userChatFriends[_user2][msg.sender][_index].heart--;
            for(uint i =0 ; i < _reactedUsers[_user2][_index].length ; i++){
                if(_reactedUsers[_user2][_index][i]._address == msg.sender && _reactedUsers[_user2][_index][i].heart == true){
                    _reactedUsers[_user2][_index][i] = _reactedUsers[_user2][_index][_reactedUsers[_user2][_index].length-1];
                     _reactedUsers[msg.sender][_index][i] = _reactedUsers[msg.sender][_index][_reactedUsers[_user2][_index].length-1];
                     break;
                }
            }
            _reactedUsers[_user2][_index].pop();
            _reactedUsers[msg.sender][_index].pop();
        }

    }

    function getHeart(address _user2, uint index) public view returns(bool){
        return (_isLiked_Hearted[_user2][msg.sender][index].heart);
    }

    // edit a post between two people which has already been sent
    function editPost(address _user2, address _sender, uint index, string memory _newMessage) onlySender(_sender) public{

        // edit this post in your address mapping
        _userChatFriends[msg.sender][_user2][index].message = _newMessage;
        _userChatFriends[msg.sender][_user2][index].edited = true;

        // edit the post in the other user's address mapping
        _userChatFriends[_user2][msg.sender][index].message = _newMessage;
        _userChatFriends[_user2][msg.sender][index].edited = true;

    }

    // send a post to other person
    function sendPost(address _user2, string memory _message) public {
        uint id = 0;
        if(_userChatFriends[msg.sender][_user2].length > 0){
            id  = _userChatFriends[msg.sender][_user2].length;
        }
        else{
            _groupsandfriends[_user2].userFriend.push(msg.sender);
        }
        post memory _post = post(0,0,false,id,block.timestamp,msg.sender,_message);
        _userChatFriends[msg.sender][_user2].push(_post);
        _userChatFriends[_user2][msg.sender].push(_post);

    }
    
    function getReactedUsers(address _address, uint _id) public view returns(adr_emoji[] memory){
        return _reactedUsers[_address][_id];
    }

    function addFriend(address _user2) public{
        _groupsandfriends[msg.sender].userFriend.push(_user2);
    }

    function getFriends() public view returns(address[] memory){
        return (_groupsandfriends[msg.sender].userFriend);
    }

    function getChats(address _user2) public view returns(post[] memory){
        return (_userChatFriends[msg.sender][_user2]);
    }

    function getGroups() public view returns(address[] memory){
        return (_groupsandfriends[msg.sender].userGroup);
    }


    // creates a group and assigns a unique address to a group
    function createGroup() public{
        address _groupAddress = address(uint160(uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,nonce)))));
        nonce++;
        _groupsandfriends[msg.sender].userGroup.push(_groupAddress);
        _isMember[_groupAddress][msg.sender] = true;
        _getGroup[_groupAddress] = group(msg.sender,_groupAddress);
    }

    // check whether a user is a member of a particular group
    modifier isGroupMember(address _groupAddress,address _user){ 
        require(_isMember[_groupAddress][_user] == true, "You aren't a member of this group");
        _;
    }
    
    // allows only admin to perfrom certain operations
    modifier onlyAdmin(address _groupaddress){
        require(msg.sender == _getGroup[_groupaddress]._admin,"Only admins can perform this operation");
        _;
    }

    function get(address _groupaddress) public view returns(group memory){
        return(_getGroup[_groupaddress]);
    }
    // add a user to a group which only an admin can do
    function addUser(address _groupaddress, address _user) onlyAdmin(_groupaddress) public{
        _isMember[_groupaddress][_user] = true;
        _groupsandfriends[_user].userGroup.push(_groupaddress);
    }
    
    function getGroupPost(address _groupAddress, uint index) public view returns(post memory){
        return _groupPosts[_groupAddress][index];
    }

    function getGroupChat(address _groupaddress) isGroupMember(_groupaddress,msg.sender) public view returns(post[] memory){
        return(_groupPosts[_groupaddress]);
    }
    // send a post in a group, requires the user to be the part of the group
    function sendGroupPost(address _groupAddress, string memory _message) isGroupMember(_groupAddress, msg.sender) public{
        uint id = 0;
        if(_groupPosts[_groupAddress].length > 0){
            id = _groupPosts[_groupAddress].length;
        }
        _groupPosts[_groupAddress].push(post(0,0,false,id,block.timestamp,msg.sender,_message));

    }   

    // like a group post, requires the user to be the part of the group
    function likeGroupPostToggle(address _groupAddress,uint index) isGroupMember(_groupAddress,msg.sender) public{
        bool isLiked = _isLiked_Hearted[_groupAddress][msg.sender][index].like;

        if(isLiked == false){
            _isLiked_Hearted[_groupAddress][msg.sender][index].like = true;
            _groupPosts[_groupAddress][index].like++;
            _reactedUsers[_groupAddress][index].push(adr_emoji(msg.sender,true,false));
        }
        else{
            _isLiked_Hearted[_groupAddress][msg.sender][index].like = false;
            _groupPosts[_groupAddress][index].like--;
            for(uint i =0 ; i < _reactedUsers[_groupAddress][index].length ; i++){
                if(_reactedUsers[_groupAddress][index][i]._address == msg.sender && _reactedUsers[_groupAddress][index][i].like == true){
                    _reactedUsers[_groupAddress][index][i] = _reactedUsers[_groupAddress][index][_reactedUsers[_groupAddress][index].length-1];
                    break;
                }
            }
            _reactedUsers[_groupAddress][index].pop();
        }
    }

    function getLikeGroup(address _groupAddress,uint index) isGroupMember(_groupAddress,msg.sender) public view returns(bool){
        return (_isLiked_Hearted[_groupAddress][msg.sender][index].like);
    }

    // give a heart emoji to a group post, requires the user to be the part of the group
    function heartGroupPostToggle(address _groupAddress,uint index) isGroupMember(_groupAddress,msg.sender) public{
        bool isHearted = _isLiked_Hearted[_groupAddress][msg.sender][index].heart;

        if(isHearted == false){
            _isLiked_Hearted[_groupAddress][msg.sender][index].heart = true;
            _groupPosts[_groupAddress][index].heart++;
            _reactedUsers[_groupAddress][index].push(adr_emoji(msg.sender,false,true));
        }
        else{
            _isLiked_Hearted[_groupAddress][msg.sender][index].heart = false;
            _groupPosts[_groupAddress][index].heart--;
            for(uint i =0 ; i < _reactedUsers[_groupAddress][index].length ; i++){
                if(_reactedUsers[_groupAddress][index][i]._address == msg.sender && _reactedUsers[_groupAddress][index][i].heart == true){
                    _reactedUsers[_groupAddress][index][i] = _reactedUsers[_groupAddress][index][_reactedUsers[_groupAddress][index].length-1];
                    break;
                }
            }
            _reactedUsers[_groupAddress][index].pop();   
        }
    }

    function getHeartGroup(address _groupAddress,uint index) isGroupMember(_groupAddress,msg.sender) public view returns(bool){
        return (_isLiked_Hearted[_groupAddress][msg.sender][index].heart);
    }

    // edit a group post, requires the user to be the part of the group as well as the sender of the post
    function editGroupPost(address _groupAddress,address _sender, uint index,string memory _newMessage) isGroupMember(_groupAddress,msg.sender) onlySender(_sender) public{
        _groupPosts[_groupAddress][index].message = _newMessage;
        _groupPosts[_groupAddress][index].edited = true;
    }
}