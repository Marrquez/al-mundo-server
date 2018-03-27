/**
 * Created by ejf3 on 11/20/13.
 */
module.exports = {
    // generic strings
    CONNECTED: 'connected!',
    ERROR: 'error',
    SUCCESS: 'success',

    // dynamo request constants
    DYN_GET_USERS: 'dynamo_get_users',
    DYN_GET_MEDIA: 'dynamo_get_media',
    DYN_GET_USER_MEDIA: 'dynamo_get_user_media',
    DYN_GET_PRIVATE: 'dynamo_get_private',
    DYN_UPDATE_USER: 'dynamo_update_user',
    DYN_UPDATE_MEDIA: 'dynamo_update_media',
    DYN_DELETE_USER: 'dynamo_delete_user',
    DYN_DELETE_MEDIA: 'dynamo_delete_media',

    // ses emails
    DYN_GET_EMAIL: 'dynamo_get_email',
    DYN_UPDATE_EMAIL: 'dynamo_update_email',
    DYN_UNSUBSCRIBE_EMAIL: 'dynamo_unsubscribe_email',
    AK: "AKIAJVVE7TEZ2QVR4JEA",
    SAK:"a29vEbW4R9vg2STCVWIzDu2VsDuBNVtL0HjeaZwP",


    SES_SEND_EMAIL: 'ses_send_email',
    MAX_EMAILS_ALLOWED: 3,

    // dynamo tables
    DYN_HOTELS_TABLE: 'hotels',
    DYN_USERSESSIONLOG_TABLE: 'T_UserSessionLog',
    DYN_STRETCHING_TABLE: 'T_Stretching',
    DYN_WARMUP_TABLE: 'T_Warmup',
    DYN_CATALOG_TABLE: 'Catalog',
    DYN_MEDIA_TABLE: 'aws_node_demo_dynamo_media',
    DYN_EMAIL_TABLE: 'aws_node_demo_dynamo_emails',

    // s3
    S3_BUCKET: 'aws-node-demos',
    S3_GET_URLPAIR: 's3_get_urlpair',
    S3_GET_URL: 's3_get_url',
    S3_PUT_URL: 's3_put_url',
    S3_KEY: 's3_key',
    S3_DELETE: 's3_delete'
};

