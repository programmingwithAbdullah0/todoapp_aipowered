"""
NLP Task Service - Parses natural language and executes task operations
"""
import re
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class NLPTaskService:
    def __init__(self):
        # Define patterns for different task operations
        self.patterns = {
            'add': [
                r'add\s+(?:a\s+|an\s+)?task\s+to\s+(.+?)(?:\s+with\s+description\s+(.+?))?(?=\s|$)',
                r'create\s+(?:a\s+|an\s+)?task\s+to\s+(.+?)(?:\s+with\s+description\s+(.+?))?(?=\s|$)',
                r'add\s+(.+?)(?:\s+with\s+description\s+(.+?))?\s+to\s+my\s+list',
                r'create\s+(.+?)(?:\s+with\s+description\s+(.+?))?\s+for\s+me',
            ],
            'complete': [
                r'mark\s+[\'"](.+?)[\'"]\s+as\s+(?:complete|done|finished)',
                r'complete\s+[\'"](.+?)[\'"]',
                r'finish\s+[\'"](.+?)[\'"]',
                r'check\s+off\s+[\'"](.+?)[\'"]',
                r'mark\s+task\s+(\d+)\s+as\s+(?:complete|done|finished)',
                r'complete\s+task\s+(\d+)',
            ],
            'delete': [
                r'delete\s+[\'"](.+?)[\'"]',
                r'remove\s+[\'"](.+?)[\'"]',
                r'delete\s+task\s+(\d+)',
                r'remove\s+task\s+(\d+)',
                r'delete\s+all\s+(?:my\s+)?tasks',
                r'remove\s+all\s+(?:my\s+)?tasks',
            ],
            'update': [
                r'update\s+[\'"](.+?)[\'"]\s+to\s+[\'"](.+?)[\'"]',
                r'change\s+[\'"](.+?)[\'"]\s+to\s+[\'"](.+?)[\'"]',
                r'edit\s+[\'"](.+?)[\'"]\s+to\s+[\'"](.+?)[\'"]',
                r'update\s+task\s+(\d+)\s+to\s+[\'"](.+?)[\'"]',
            ],
            'list': [
                r'(?:show|display|list|view)\s+(?:my\s+)?(?:tasks|todo|to-do)',
                r'what\s+(?:do\s+I|should\s+I)\s+(?:do|have\s+to\s+do)',
                r'what\'?s\s+(?:on\s+)?(?:my\s+)?(?:list|tasks)',
            ]
        }

    def parse_message(self, message: str) -> Dict[str, Any]:
        """
        Parse a natural language message and determine the intended task operation
        """
        message_lower = message.lower().strip()
        
        # Check for add operations
        for pattern in self.patterns['add']:
            match = re.search(pattern, message_lower)
            if match:
                title = match.group(1).strip()
                description = match.group(2).strip() if match.lastindex >= 2 and match.group(2) else ""
                return {
                    'operation': 'add',
                    'title': title,
                    'description': description
                }
        
        # Check for complete operations
        for pattern in self.patterns['complete']:
            match = re.search(pattern, message_lower)
            if match:
                title_or_id = match.group(1).strip() if match.lastindex >= 1 else None
                return {
                    'operation': 'complete',
                    'identifier': title_or_id
                }
        
        # Check for delete operations
        # First check for delete all tasks pattern specifically
        if re.search(r'delete\s+all\s+(?:my\s+)?tasks|remove\s+all\s+(?:my\s+)?tasks', message_lower):
            return {
                'operation': 'delete',
                'delete_all': True
            }
        
        # Then check for individual delete patterns
        for pattern in self.patterns['delete']:
            # Skip the "all tasks" patterns since we already handled them
            if 'all' in pattern:
                continue
            match = re.search(pattern, message_lower)
            if match:
                title_or_id = match.group(1).strip() if match.lastindex >= 1 else None
                return {
                    'operation': 'delete',
                    'identifier': title_or_id
                }
        
        # Check for update operations
        for pattern in self.patterns['update']:
            match = re.search(pattern, message_lower)
            if match:
                old_title_or_id = match.group(1).strip()
                new_title = match.group(2).strip()
                return {
                    'operation': 'update',
                    'old_identifier': old_title_or_id,
                    'new_title': new_title
                }
        
        # Check for list operations
        for pattern in self.patterns['list']:
            if re.search(pattern, message_lower):
                return {
                    'operation': 'list'
                }
        
        # If no pattern matches, return as regular chat
        return {
            'operation': 'chat'
        }

    async def execute_operation(
        self, 
        operation: Dict[str, Any], 
        user_id: str
    ) -> Dict[str, Any]:
        """
        Execute the parsed operation using the existing task tools
        """
        op_type = operation['operation']
        
        if op_type == 'add':
            from mcp_server.tools.add_task import add_task
            result = await add_task(
                user_id=user_id,
                title=operation['title'],
                description=operation.get('description', '')
            )
            return result
            
        elif op_type == 'complete':
            from mcp_server.tools.complete_task import complete_task
            identifier = operation['identifier']
            # Determine if it's an ID or title
            if identifier.isdigit():
                result = await complete_task(
                    user_id=user_id,
                    task_id=int(identifier)
                )
            else:
                result = await complete_task(
                    user_id=user_id,
                    task_title=identifier
                )
            return result
            
        elif op_type == 'delete':
            from mcp_server.tools.delete_task import delete_task
            identifier = operation.get('identifier')
            
            # Check if this is a request to delete all tasks
            if identifier is None and 'delete_all' in operation:
                # For deleting all tasks, we need to list all tasks first and then delete them one by one
                from mcp_server.tools.list_tasks import list_tasks
                all_tasks = await list_tasks(user_id=user_id)
                
                if isinstance(all_tasks, list) and len(all_tasks) > 0:
                    results = []
                    for task in all_tasks:
                        if 'id' in task:
                            result = await delete_task(
                                user_id=user_id,
                                task_id=task['id']
                            )
                            results.append(result)
                    return {
                        'message': f'Successfully deleted {len(results)} tasks',
                        'deleted_count': len(results)
                    }
                else:
                    return {
                        'message': 'No tasks to delete',
                        'deleted_count': 0
                    }
            else:
                # Regular delete operation
                # Determine if it's an ID or title
                if identifier.isdigit():
                    result = await delete_task(
                        user_id=user_id,
                        task_id=int(identifier)
                    )
                else:
                    result = await delete_task(
                        user_id=user_id,
                        task_title=identifier
                    )
                return result
            
        elif op_type == 'update':
            from mcp_server.tools.update_task import update_task
            old_identifier = operation['old_identifier']
            new_title = operation['new_title']
            
            # Determine if old_identifier is an ID or title
            if old_identifier.isdigit():
                result = await update_task(
                    user_id=user_id,
                    task_id=int(old_identifier),
                    title=new_title
                )
            else:
                result = await update_task(
                    user_id=user_id,
                    task_title=old_identifier,
                    title=new_title
                )
            return result
            
        elif op_type == 'list':
            from mcp_server.tools.list_tasks import list_tasks
            result = await list_tasks(user_id=user_id)
            return result
        else:
            # For regular chat, return None to indicate no operation was executed
            return None