/**
 * 国际象棋AI引擎
 * 使用极小化极大算法与Alpha-Beta剪枝实现
 */
class ChessAI {
    constructor(difficulty = 'medium') {
        this.setDifficulty(difficulty);
        this.pieceValues = {
            'P': 10,
            'N': 30,
            'B': 30,
            'R': 50,
            'Q': 90,
            'K': 900
        };
        
        // 棋子位置价值评估表
        this.pawnEvalWhite = [
            [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
            [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
            [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
            [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
            [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
            [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
            [0.5,  1.0,  1.0, -2.0, -2.0,  1.0,  1.0,  0.5],
            [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
        ];
        
        this.knightEval = [
            [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
            [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
            [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
            [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
            [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
            [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
            [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
            [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
        ];
        
        this.bishopEvalWhite = [
            [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
            [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
            [-1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
            [-1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
            [-1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
            [-1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
            [-1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
            [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
        ];
        
        this.rookEvalWhite = [
            [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
            [0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
            [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [0.0,  0.0,  0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
        ];
        
        this.queenEval = [
            [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
            [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
            [-1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
            [-0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
            [0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
            [-1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
            [-1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
            [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
        ];
        
        this.kingEvalWhite = [
            [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
            [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
            [2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
            [2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
        ];
        
        // 游戏结束阶段，王要更积极
        this.kingEndgameEvalWhite = [
            [-5.0, -4.0, -3.0, -2.0, -2.0, -3.0, -4.0, -5.0],
            [-3.0, -2.0, -1.0,  0.0,  0.0, -1.0, -2.0, -3.0],
            [-3.0, -1.0,  2.0,  3.0,  3.0,  2.0, -1.0, -3.0],
            [-3.0, -1.0,  3.0,  4.0,  4.0,  3.0, -1.0, -3.0],
            [-3.0, -1.0,  3.0,  4.0,  4.0,  3.0, -1.0, -3.0],
            [-3.0, -1.0,  2.0,  3.0,  3.0,  2.0, -1.0, -3.0],
            [-3.0, -3.0,  0.0,  0.0,  0.0,  0.0, -3.0, -3.0],
            [-5.0, -3.0, -3.0, -3.0, -3.0, -3.0, -3.0, -5.0]
        ];
    }

    // 设置AI难度
    setDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                this.searchDepth = 2;
                break;
            case 'medium':
                this.searchDepth = 3;
                break;
            case 'hard':
                this.searchDepth = 4;
                break;
            default:
                this.searchDepth = 3;
        }
    }

    // 获取AI建议的最佳移动
    getBestMove(engine) {
        const startTime = Date.now();
        const bestMove = this.minimaxRoot(this.searchDepth, engine, true);
        const endTime = Date.now();
        
        console.log(`AI思考时间: ${endTime - startTime}ms`);
        return bestMove;
    }

    // 极小化极大算法根节点，返回最佳移动
    minimaxRoot(depth, engine, isMaximizingPlayer) {
        const newGameMoves = this.generateAllPossibleMoves(engine);
        let bestMove = null;
        let bestValue = isMaximizingPlayer ? -9999 : 9999;
        const playerColor = engine.currentPlayer;
        
        for (const move of newGameMoves) {
            const [fromRow, fromCol, toRow, toCol] = move;
            
            // 模拟移动
            const originalPiece = engine.getPiece(toRow, toCol);
            const movingPiece = engine.getPiece(fromRow, fromCol);
            
            engine.makeMove(fromRow, fromCol, toRow, toCol);
            
            // 递归评估
            const value = this.minimax(depth - 1, engine, -10000, 10000, !isMaximizingPlayer);
            
            // 撤销移动(makeMove已经交换了玩家，所以再交换回来)
            engine.undoLastMove();
            
            if (isMaximizingPlayer) {
                if (value > bestValue) {
                    bestValue = value;
                    bestMove = move;
                }
            } else {
                if (value < bestValue) {
                    bestValue = value;
                    bestMove = move;
                }
            }
        }
        
        return bestMove;
    }

    // 极小化极大算法 + Alpha-Beta剪枝
    minimax(depth, engine, alpha, beta, isMaximizingPlayer) {
        if (depth === 0) {
            return this.evaluateBoard(engine);
        }
        
        const possibleMoves = this.generateAllPossibleMoves(engine);
        
        // 如果没有可能的移动，检查是否将军（将杀或和局）
        if (possibleMoves.length === 0) {
            if (engine.isKingInCheck(engine.currentPlayer)) {
                // 将杀，当前玩家输了
                return isMaximizingPlayer ? -9000 : 9000;
            } else {
                // 和局
                return 0;
            }
        }
        
        if (isMaximizingPlayer) {
            let value = -9999;
            
            for (const move of possibleMoves) {
                const [fromRow, fromCol, toRow, toCol] = move;
                
                engine.makeMove(fromRow, fromCol, toRow, toCol);
                value = Math.max(value, this.minimax(depth - 1, engine, alpha, beta, !isMaximizingPlayer));
                engine.undoLastMove();
                
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break; // Beta剪枝
                }
            }
            
            return value;
        } else {
            let value = 9999;
            
            for (const move of possibleMoves) {
                const [fromRow, fromCol, toRow, toCol] = move;
                
                engine.makeMove(fromRow, fromCol, toRow, toCol);
                value = Math.min(value, this.minimax(depth - 1, engine, alpha, beta, !isMaximizingPlayer));
                engine.undoLastMove();
                
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break; // Alpha剪枝
                }
            }
            
            return value;
        }
    }

    // 生成所有可能的移动
    generateAllPossibleMoves(engine) {
        const moves = [];
        const currentPlayer = engine.currentPlayer;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = engine.getPiece(row, col);
                
                if (piece && engine.getPieceColor(piece) === currentPlayer) {
                    // 对每一个棋子，尝试移动到棋盘上的每一个位置
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (engine.isValidMove(row, col, toRow, toCol)) {
                                moves.push([row, col, toRow, toCol]);
                            }
                        }
                    }
                }
            }
        }
        
        return moves;
    }

    // 评估棋盘状态
    evaluateBoard(engine) {
        // 如果游戏结束，直接返回大的正/负值
        if (engine.gameOver) {
            if (engine.isCheckmate()) {
                // 上一个走棋的玩家获胜
                return engine.currentPlayer === 'w' ? -9000 : 9000;
            } else {
                // 和局
                return 0;
            }
        }
        
        let value = 0;
        
        // 考虑是否是残局（简单判断：棋盘上重子少于等于6个）
        let heavyPieces = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = engine.getPiece(row, col);
                if (piece && ['Q', 'R'].includes(engine.getPieceType(piece))) {
                    heavyPieces++;
                }
            }
        }
        const isEndgame = heavyPieces <= 6;
        
        // 棋子价值 + 位置价值
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = engine.getPiece(row, col);
                if (!piece) continue;
                
                const pieceType = engine.getPieceType(piece);
                const pieceColor = engine.getPieceColor(piece);
                
                // 基础棋子价值
                let pieceValue = this.pieceValues[pieceType];
                if (pieceColor === 'b') {
                    pieceValue = -pieceValue;
                }
                
                // 位置价值
                let positionValue = 0;
                
                switch (pieceType) {
                    case 'P':
                        positionValue = this.pawnEvalWhite[row][col];
                        break;
                    case 'N':
                        positionValue = this.knightEval[row][col];
                        break;
                    case 'B':
                        positionValue = this.bishopEvalWhite[row][col];
                        break;
                    case 'R':
                        positionValue = this.rookEvalWhite[row][col];
                        break;
                    case 'Q':
                        positionValue = this.queenEval[row][col];
                        break;
                    case 'K':
                        positionValue = isEndgame ? 
                                      this.kingEndgameEvalWhite[row][col] : 
                                      this.kingEvalWhite[row][col];
                        break;
                }
                
                // 黑方的评估表要翻转
                if (pieceColor === 'b') {
                    positionValue = -positionValue;
                    // 黑方棋子位置要从底端翻转
                    if (['P', 'B', 'R', 'K'].includes(pieceType)) {
                        positionValue = -this.getReversedPositionValue(pieceType, row, col, isEndgame);
                    }
                }
                
                value += pieceValue + positionValue;
            }
        }
        
        // 机动性奖励
        const mobilityBonus = this.generateAllPossibleMoves(engine).length * 0.1;
        value += engine.currentPlayer === 'w' ? mobilityBonus : -mobilityBonus;
        
        // 被将军惩罚
        if (engine.isKingInCheck(engine.currentPlayer)) {
            value += engine.currentPlayer === 'w' ? -5 : 5;
        }
        
        return value;
    }

    // 为黑方翻转位置评估表
    getReversedPositionValue(pieceType, row, col, isEndgame) {
        // 黑方的位置评估是白方的镜像翻转
        const reversedRow = 7 - row;
        
        switch (pieceType) {
            case 'P':
                return this.pawnEvalWhite[reversedRow][col];
            case 'B':
                return this.bishopEvalWhite[reversedRow][col];
            case 'R':
                return this.rookEvalWhite[reversedRow][col];
            case 'K':
                return isEndgame ? 
                      this.kingEndgameEvalWhite[reversedRow][col] : 
                      this.kingEvalWhite[reversedRow][col];
            default:
                return 0;
        }
    }
}

// 导出类使其可以被其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessAI;
} 