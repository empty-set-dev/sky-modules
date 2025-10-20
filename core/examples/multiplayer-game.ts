/**
 * Multiplayer Game Example
 *
 * This example demonstrates how to use Sky Core's define and share systems
 * to create a real-time multiplayer game with automatic state synchronization.
 *
 * Features:
 * - Real-time player movement
 * - Automatic state sync to all clients
 * - Efficient network protocol (only changes sent)
 * - Type-safe reactive state
 */

import '@sky-modules/core/define'

// ============================================================================
// Game Entities
// ============================================================================

@define('game.Player')
class Player {
    @string name = ''
    @number x = 0
    @number y = 0
    @number health = 100
    @number score = 0
    @boolean isAlive = true

    move(dx: number, dy: number): void {
        this.x += dx
        this.y += dy
    }

    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount)
        if (this.health === 0) {
            this.isAlive = false
        }
    }

    heal(amount: number): void {
        this.health = Math.min(100, this.health + amount)
    }

    addScore(points: number): void {
        this.score += points
    }
}

@define('game.Enemy')
class Enemy {
    @number x = 0
    @number y = 0
    @number health = 50
    @string type = 'basic'

    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount)
    }

    get isAlive(): boolean {
        return this.health > 0
    }
}

@define('game.GameState')
class GameState {
    @array(Player) players = []
    @array(Enemy) enemies = []
    @number wave = 1
    @boolean isGameOver = false

    addPlayer(name: string): Player {
        const player = new Player()
        player.name = name
        player.x = Math.random() * 800
        player.y = Math.random() * 600
        this.players.push(player)
        return player
    }

    removePlayer(playerId: number): void {
        const index = this.players.findIndex((_, i) => i === playerId)
        if (index !== -1) {
            this.players.splice(index, 1)
        }
    }

    spawnEnemy(type: string = 'basic'): Enemy {
        const enemy = new Enemy()
        enemy.type = type
        enemy.x = Math.random() * 800
        enemy.y = Math.random() * 600
        enemy.health = type === 'boss' ? 200 : 50
        this.enemies.push(enemy)
        return enemy
    }

    update(deltaTime: number): void {
        // Remove dead enemies
        this.enemies = this.enemies.filter(e => e.isAlive)

        // Check game over
        if (this.players.every(p => !p.isAlive)) {
            this.isGameOver = true
        }
    }
}

// ============================================================================
// Server-side Code
// ============================================================================

class GameServer {
    private game: GameState
    private updateInterval: NodeJS.Timeout | null = null
    private clients: Set<WebSocket> = new Set()

    constructor() {
        this.game = new GameState()

        // Share game state - all changes automatically synced
        share(this.game, (updates, pretty) => {
            // Send only changes to all clients (efficient!)
            this.broadcast({
                type: 'game:update',
                updates: updates
            })

            // Log for debugging
            if (pretty.set.length > 0) {
                console.log('State changed:', pretty.set)
            }
        })

        this.startGameLoop()
    }

    startGameLoop(): void {
        // Update game 60 times per second
        this.updateInterval = setInterval(() => {
            this.game.update(1 / 60)

            // Spawn enemies periodically
            if (Math.random() < 0.01) {
                this.game.spawnEnemy()
            }
        }, 1000 / 60)
    }

    onClientConnect(ws: WebSocket): void {
        this.clients.add(ws)

        // Send initial game state
        ws.send(JSON.stringify({
            type: 'game:init',
            state: save(this.game)
        }))

        // Handle client messages
        ws.on('message', (data) => {
            const message = JSON.parse(data.toString())
            this.handleClientMessage(ws, message)
        })

        ws.on('close', () => {
            this.clients.delete(ws)
            // Remove player (automatically synced to all clients)
            const playerIndex = Array.from(this.clients).indexOf(ws)
            if (playerIndex !== -1) {
                this.game.removePlayer(playerIndex)
            }
        })
    }

    handleClientMessage(ws: WebSocket, message: any): void {
        switch (message.type) {
            case 'player:join':
                const player = this.game.addPlayer(message.name)
                // Change automatically synced to all clients!
                ws.send(JSON.stringify({
                    type: 'player:joined',
                    playerId: this.game.players.indexOf(player)
                }))
                break

            case 'player:move':
                const p = this.game.players[message.playerId]
                if (p) {
                    p.move(message.dx, message.dy)
                    // Movement automatically synced!
                }
                break

            case 'player:attack':
                const attacker = this.game.players[message.playerId]
                const enemy = this.game.enemies[message.enemyId]
                if (attacker && enemy) {
                    enemy.takeDamage(10)
                    if (!enemy.isAlive) {
                        attacker.addScore(10)
                    }
                    // Damage and score automatically synced!
                }
                break
        }
    }

    broadcast(message: any): void {
        const data = JSON.stringify(message)
        this.clients.forEach(client => {
            client.send(data)
        })
    }

    stop(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval)
        }
    }
}

// ============================================================================
// Client-side Code
// ============================================================================

class GameClient {
    private game: GameState | null = null
    private ws: WebSocket
    private playerId: number = -1

    constructor(serverUrl: string) {
        this.ws = new WebSocket(serverUrl)

        this.ws.on('open', () => {
            console.log('Connected to server')
            this.joinGame('Player')
        })

        this.ws.on('message', (data) => {
            const message = JSON.parse(data.toString())
            this.handleServerMessage(message)
        })
    }

    handleServerMessage(message: any): void {
        switch (message.type) {
            case 'game:init':
                // Load initial game state
                this.game = load(message.state)
                console.log('Game loaded:', this.game)
                break

            case 'game:update':
                // Apply incremental updates
                if (this.game) {
                    apply(this.game, message.updates)
                }
                break

            case 'player:joined':
                this.playerId = message.playerId
                console.log('Joined as player', this.playerId)
                break
        }
    }

    joinGame(name: string): void {
        this.ws.send(JSON.stringify({
            type: 'player:join',
            name: name
        }))
    }

    movePlayer(dx: number, dy: number): void {
        this.ws.send(JSON.stringify({
            type: 'player:move',
            playerId: this.playerId,
            dx: dx,
            dy: dy
        }))
    }

    attackEnemy(enemyId: number): void {
        this.ws.send(JSON.stringify({
            type: 'player:attack',
            playerId: this.playerId,
            enemyId: enemyId
        }))
    }

    // React to state changes locally
    setupReactions(): void {
        if (!this.game) return

        // Auto-render when game state changes
        reaction(() => {
            this.render()
        })
    }

    render(): void {
        if (!this.game) return

        console.clear()
        console.log('=== Game State ===')
        console.log(`Wave: ${this.game.wave}`)
        console.log(`Players: ${this.game.players.length}`)
        console.log(`Enemies: ${this.game.enemies.length}`)

        this.game.players.forEach((p, i) => {
            console.log(`  Player ${i}: ${p.name} HP:${p.health} Score:${p.score}`)
        })
    }
}

// ============================================================================
// Usage Example
// ============================================================================

// Server
const server = new GameServer()

// Clients
const client1 = new GameClient('ws://localhost:3000')
const client2 = new GameClient('ws://localhost:3000')

// Simulate gameplay
setTimeout(() => {
    client1.movePlayer(10, 0)   // Automatically synced to client2!
    client2.movePlayer(0, 10)   // Automatically synced to client1!

    client1.attackEnemy(0)      // Damage synced to all clients!
}, 1000)

/**
 * Network Traffic Analysis:
 *
 * Without Sky Core (sending full state):
 * - Initial state: ~500 bytes
 * - Each update: ~500 bytes
 * - 60 updates/sec = 30 KB/sec per client
 *
 * With Sky Core (sending only changes):
 * - Initial state: ~500 bytes
 * - Position update: ~20 bytes
 * - Damage update: ~15 bytes
 * - 60 updates/sec = 1-2 KB/sec per client
 *
 * Bandwidth savings: ~95%!
 */
