import chess

class Chess:
    def __init__(self):
        self.board = chess.Board()

    def evaluate_board(self, board):
        # Simple evaluation function: material balance
        material = sum(board.piece_type_at(i) for i in range(64))
        return material if board.turn == chess.WHITE else -material

    def minimax(self, board, depth, alpha, beta, maximizing_player):
        if depth == 0 or board.is_game_over():
            return self.evaluate_board(board), None

        best_move = None
        if maximizing_player:
            max_eval = -float('inf')
            for move in board.legal_moves:
                board.push(move)
                eval = self.minimax(board, depth - 1, alpha, beta, False)[0]
                board.pop()
                if eval > max_eval:
                    max_eval = eval
                    best_move = move
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
            return max_eval, best_move
        else:
            min_eval = float('inf')
            for move in board.legal_moves:
                board.push(move)
                eval = self.minimax(board, depth - 1, alpha, beta, True)[0]
                board.pop()
                if eval < min_eval:
                    min_eval = eval
                    best_move = move
                beta = min(beta, eval)
                if beta <= alpha:
                    break
            return min_eval, best_move

    def make_move(self, move_uci, fen=None):
        if fen:
            self.board.set_fen(fen)

        if move_uci:
            move = chess.Move.from_uci(move_uci)
            if move in self.board.legal_moves:
                self.board.push(move)
            else:
                raise ValueError("Illegal move")

        _, ai_move = self.minimax(self.board, depth=3, alpha=-float('inf'), beta=float('inf'), maximizing_player=self.board.turn == chess.WHITE)
        if ai_move:
            self.board.push(ai_move)

        return {"ai_move": ai_move.uci() if ai_move else None, "fen": self.board.fen()}

    def reset(self):
        self.board.reset()

    def get_fen(self):
        return self.board.fen()
