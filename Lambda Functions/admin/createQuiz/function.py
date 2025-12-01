import json
import boto3
import uuid
from datetime import datetime
 
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Quizzes')
 
def lambda_handler(event, context):
    try:
        # Authorization
        claims = event['requestContext']['authorizer']['claims']
        groups = claims.get('cognito:groups', '')
 
        if not groups or 'Admins' not in groups:
            return {
                'statusCode': 403,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Authorization, Content-Type",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
                },
                'body': json.dumps({'error': 'Access denied: Admins only'})
            }
 
        # Parse input
        body = json.loads(event['body'])
        title = body.get('title')
        topic = body.get('topic')
        duration = body.get('duration')
        marks = body.get('marks')
        question_ids = body.get('question_ids', [])
 
        if not (title and topic and duration and marks and question_ids):
            return {
                'statusCode': 400,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Authorization, Content-Type",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
                },
                'body': json.dumps({'error': 'Missing required fields'})
            }
 
        quiz_id = f"quiz-{str(uuid.uuid4())[:8]}"
        created_at = datetime.utcnow().isoformat()
 
        # Save quiz to DynamoDB
        table.put_item(
            Item={
                'quiz_id': quiz_id,
                'title': title,
                'topic': topic,
                'duration': duration,
                'marks': marks,
                'question_ids': question_ids,
                'created_at': created_at
            }
        )
 
        return {
            'statusCode': 200,
            "headers": {   
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Authorization, Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            'body': json.dumps({
                'message': 'Quiz created successfully',
                'quiz_id': quiz_id
            })
        }
 
    except Exception as e:
        print("Error:", str(e))
        return {
            'statusCode': 500,
            "headers": {   
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Authorization, Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            'body': json.dumps({'error': str(e)})
        }
