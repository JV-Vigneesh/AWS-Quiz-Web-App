import json
import boto3
import decimal
import uuid
 
dynamodb = boto3.resource('dynamodb')
quizzes_table = dynamodb.Table('Quizzes')
questions_table = dynamodb.Table('QuestionBank')
results_table = dynamodb.Table('Results')
 
def decimal_to_native(obj):
    if isinstance(obj, list):
        return [decimal_to_native(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: decimal_to_native(v) for k, v in obj.items()}
    elif isinstance(obj, decimal.Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    else:
        return obj
 
def lambda_handler(event, context):
    try:
        # Parse body
        body = json.loads(event.get('body', '{}'))
        quiz_id = body.get('quiz_id')
        user_answers = body.get('answers', {})
 
        if not quiz_id or not user_answers:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing quiz_id or answers"})
            }
 
        # Extract user info
        claims = event.get('requestContext', {}).get('authorizer', {}).get('claims', {})
        user_email = claims.get('email', 'unknown@example.com')
        user_name = claims.get('name', 'Anonymous User')
 
        # Get quiz info
        quiz = quizzes_table.get_item(Key={'quiz_id': quiz_id}).get('Item')
        if not quiz:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Quiz not found"})
            }
 
        # Retrieve question details & calculate score
        question_ids = quiz.get('question_ids', [])
        total_score = 0
        correct_count = 0
 
        correct_answers_map = {}  # NEW — stores correct answers to send to frontend
 
        for qid in question_ids:
            question_item = questions_table.get_item(Key={'question_id': qid}).get('Item')
            if not question_item:
                continue
 
            correct_answer = question_item.get('answer', '')
            correct_answers_map[qid] = correct_answer  # Store correct answer
 
            # Compare user vs correct
            if correct_answer.strip().lower() == str(user_answers.get(qid, '')).strip().lower():
                correct_count += 1
                total_score += quiz.get('marks_per_question', 1)
 
        # Save result
        result_id = f"res-{str(uuid.uuid4())[:8]}"
        results_table.put_item(Item={
            'result_id': result_id,
            'quiz_id': quiz_id,
            'user_email': user_email,
            'user_name': user_name,
            'answers': user_answers,
            'score': total_score
        })
 
        # Now returning correct answers map to frontend
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": json.dumps({
                "message": "Quiz submitted successfully",
                "quiz_id": quiz_id,
                "score": total_score,
                "correct_answers": correct_answers_map,  # NOT count, actual answers
                "result_id": result_id
            })
        }
 
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
