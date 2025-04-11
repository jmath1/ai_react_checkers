from flask import Flask, request, jsonify
from flask_cors import CORS
import copy
import random

app = Flask(__name__)
CORS(app)

DEPTH = 5 
# Initial board: 1 = Red (player), -1 = Black (AI), 0 = Empty, 2 = Red King, -2 = Black King
initial_board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0]
]

# Global game state
current_board = copy.deepcopy(initial_board)

# Heuristic evaluation function
def evaluate_board(board):
    red_pieces = sum(row.count(1) + row.count(2) * 1.5 for row in board)  # Kings worth more
    black_pieces = sum(row.count(-1) + row.count(-2) * 1.5 for row in board)
    return black_pieces - red_pieces  # Positive = good for Black (AI)

# Get all possible moves for a player
def get_possible_moves(board, player):
    moves = []
    for row in range(8):
        for col in range(8):
            piece = board[row][col]
            if (player == 1 and piece > 0) or (player == -1 and piece < 0):
                is_king = abs(piece) == 2
                directions = [(-1, -1), (-1, 1), (1, -1), (1, 1)] if is_king else \
                             ([(1, -1), (1, 1)] if player == 1 else [(-1, -1), (-1, 1)])
                for dr, dc in directions:
                    # Simple move
                    new_row, new_col = row + dr, col + dc
                    if 0 <= new_row < 8 and 0 <= new_col < 8 and board[new_row][new_col] == 0:
                        moves.append((row, col, new_row, new_col))
                    # Jump
                    jump_row, jump_col = row + 2 * dr, col + 2 * dc
                    mid_row, mid_col = row + dr, col + dc
                    if (0 <= jump_row < 8 and 0 <= jump_col < 8 and board[jump_row][jump_col] == 0 and
                        board[mid_row][mid_col] != 0 and (player * board[mid_row][mid_col] < 0)):
                        moves.append((row, col, jump_row, jump_col))
    return moves

def apply_move(board, move):
    """
    Applies a move to the given checkers board and returns the resulting board state.
    Args:
        board (list[list[int]]): A 2D list representing the current state of the checkers board.
                                 Each element represents a piece or an empty square:
                                 0  - Empty square
                                 1  - Red piece
                                 -1 - Black piece
                                 2  - Red king
                                 -2 - Black king
        move (tuple[int, int, int, int]): A tuple representing the move to be applied.
                                          Format: (from_row, from_col, to_row, to_col)
    Returns:
        list[list[int]]: A new 2D list representing the updated state of the board after the move.
    Behavior:
        - Moves the piece from the starting position (from_row, from_col) to the target position (to_row, to_col).
        - If the move is a jump (distance of 2), removes the jumped piece from the board.
        - Promotes a piece to a king if it reaches the opponent's back row:
            - Black piece (-1) becomes a Black king (-2) when reaching row 0.
            - Red piece (1) becomes a Red king (2) when reaching row 7.
    """
    
    new_board = [row[:] for row in board]
    from_row, from_col, to_row, to_col = move
    piece = new_board[from_row][from_col]
    new_board[to_row][to_col] = piece
    new_board[from_row][from_col] = 0
    if abs(to_row - from_row) == 2:
        mid_row = (from_row + to_row) // 2
        mid_col = (from_col + to_col) // 2
        new_board[mid_row][mid_col] = 0
    if to_row == 0 and piece == -1:  # Black king
        new_board[to_row][to_col] = -2
    if to_row == 7 and piece == 1:   # Red king
        new_board[to_row][to_col] = 2
    return new_board


def minimax(board, depth, maximizing_player, alpha, beta):
    """
    Implements the Minimax algorithm with Alpha-Beta pruning to determine the 
    optimal move in a two-player game.
    Args:
        board (list): The current state of the game board.
        depth (int): The maximum depth to search in the game tree.
        maximizing_player (bool): True if the current player is the maximizing 
            player (AI/black), False if the current player is the minimizing 
            player (human/red).
        alpha (float): The best value that the maximizing player can guarantee 
            so far (initially set to negative infinity).
        beta (float): The best value that the minimizing player can guarantee 
            so far (initially set to positive infinity).
    Returns:
        tuple: A tuple containing:
            - eval_score (float): The evaluation score of the board state.
            - best_move (any): The best move for the current player, or None 
              if no moves are available.
    """
    if depth == 0 or not get_possible_moves(board, 1) or not get_possible_moves(board, -1):
        return evaluate_board(board), None
    
    if maximizing_player:  # maximizing player is AI/black
        max_eval = float('-inf')
        best_move = None
        
        # loop through all possible moves for black and evaluate them
        # return the best move and its max evaluation
        for move in get_possible_moves(board, -1):
            
            new_board = apply_move(board, move)
            eval_score, _ = minimax(new_board, depth - 1, False, alpha, beta)
            if eval_score > max_eval:
                max_eval = eval_score
                best_move = move
            alpha = max(alpha, eval_score)
            if beta <= alpha:
                break
        return max_eval, best_move
    else:  # Player (Red)
        min_eval = float('inf')
        best_move = None
        for move in get_possible_moves(board, 1):
            new_board = apply_move(board, move)
            eval_score, _ = minimax(new_board, depth - 1, True, alpha, beta)
            if eval_score < min_eval:
                min_eval = eval_score
                best_move = move
            beta = min(beta, eval_score)
            if beta <= alpha:
                break
        return min_eval, best_move

@app.route('/move', methods=['POST'])
def make_move():
    """
    receive player's move and return AI's move
    """
    global current_board
    data = request.get_json()
    from_row, from_col, to_row, to_col = data['move']
    
    current_board = apply_move(current_board, (from_row, from_col, to_row, to_col))
    
    # Check if game is over
    if not get_possible_moves(current_board, -1):
        return jsonify({"board": current_board, "ai_move": None, "game_over": True})
    
    # AI's turn (Black)
    _, ai_move = minimax(current_board, DEPTH, True, float('-inf'), float('inf'))
    if ai_move:
        current_board = apply_move(current_board, ai_move)
    
    return jsonify({
        "board": current_board,
        "ai_move": ai_move,  # [from_row, from_col, to_row, to_col]
        "game_over": not get_possible_moves(current_board, 1)
    })

# Reset game
@app.route('/reset', methods=['POST'])
def reset_game():
    global current_board
    current_board = copy.deepcopy(initial_board)
    return jsonify({"board": current_board})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)