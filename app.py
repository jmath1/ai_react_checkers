from flask import Flask, request, jsonify
from flask_cors import CORS
from logic.checkers_logic import Checkers
from logic.chess_logic import Chess

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


checkers_game = Checkers()
chess_game = Chess()

# Checkers routes
@app.route('/checkers/move', methods=['POST'])
def checkers_move():
    try:
        data = request.get_json()
        move = data.get('move')  # e.g., [from_row, from_col, to_row, to_col]
        if not move:
            return jsonify({'error': 'Move data is required'}), 400

        checkers_game.apply_player_move(move)

        # Check if game is over
        if not checkers_game.has_moves(1):  # AI has no moves
            return jsonify({"board": checkers_game.current_board, "ai_move": None, "game_over": True})

        # AI's turn
        ai_move = checkers_game.get_ai_move()
        return jsonify({
            "board": checkers_game.current_board,
            "ai_move": ai_move,
            "game_over": not checkers_game.has_moves(-1)  # Player has no moves
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/checkers/reset', methods=['POST'])
def checkers_reset():
    checkers_game.reset()
    return jsonify({"board": checkers_game.current_board})

# Chess routes
@app.route('/chess/move', methods=['POST'])
def chess_move():
    try:
        data = request.get_json()
        move_uci = data.get('move')  # e.g., "e2e4"
        fen = data.get('fen')  # Current board position

        result = chess_game.make_move(move_uci, fen)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chess/reset', methods=['POST'])
def chess_reset():
    chess_game.reset()
    return jsonify({"fen": chess_game.get_fen()})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)