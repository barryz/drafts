// Error handle

// throw a exception
/*
throw "Non postive number!";
throw true;
*/

function UserException(msg) {
    this.message = msg;
    this.name = "User Exception";
}

// throw new UserException("use not allowed");


// try catch [finally] ... statement
function isPostive(x) {
    if (x < 0) {
        throw new UserException('x not a postive')
    }
}

try {
    let ok = isPostive(-10);
} catch (e) {
    ok = "ok";
    console.log(e);
} finally {

    console.log("finally result is " + ok);
}

/* 
UserException { message: 'x not a postive', name: 'User Exception' }
finally result is ok
*/