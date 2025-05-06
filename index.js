// A simple token-based authorizer example to demonstrate how to use an authorization token 
// to allow or deny a request. In this example, the caller named 'user' is allowed to invoke 
// a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke 
// the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
// string, the authorizer function returns an HTTP 401 status code. For any other token value, 
// the authorizer returns an HTTP 500 status code. 
// Note that token values are case-sensitive.

exports.handler = async function(event, context) {
    const token = event.token;
    switch (token) {
        case '12345':
            return generatePolicy('*', 'Allow', event.methodArn);
        case '22222':
            return generatePolicy('*', 'Deny', event.methodArn);
        case 'unauthorized':
            throw new Error("Unauthorized");   // Return a 401 Unauthorized response
        default:
            throw new Error("Error: Invalid token"); // Return a 500 Invalid token response
    }
};

// Help function to generate an IAM policy
const generatePolicy = function(principalId, effect, resource) {
    const authResponse = {
        principalId: principalId
    };
    
    if (effect && resource) {
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        };
        authResponse.policyDocument = policyDocument;
    }
    
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": true
    };
    
    console.log(JSON.stringify(authResponse));
    return authResponse;
};