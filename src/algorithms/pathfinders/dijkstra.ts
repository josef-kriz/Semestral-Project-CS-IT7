import EdgeCost from '../models/edgecost';
import Graph from '../models/graph';
import Vertex from '../models/vertex';
import MinHeap from './minheap';
import Path from './path';
/**
 * Implements Dijkstra's algorithm to find the shortest path between 2 vertices
 */
export default class DijkstraPathfinder {

    /**
     * Stores all the pathing data found by algorithm
     */
    distances: Map<number, {
        distance: number;
        sourceID: number;
    }>;

    /**
     * Queue for getting the next vertex
     */
    vertexQueue: MinHeap;

    /**
     * stores all visited vertex ids
     */
    visited: Set<number>;

    /**
     * Returns an array of vertex IDs that represents the shortest path between 2 vertices
     * @param startID : ID of starting vertex
     * @param endID : ID of destination vertex
     * @param mygraph : relevant graph
     */
    FindPath(startID: number, endID: number, mygraph: Graph): Path {
        this.Initialize(mygraph);
        this.distances.set(startID, {distance: 0, sourceID: -9001});
        this.visited.delete(startID);
        let currentVertex = mygraph.getVertex(startID);
        while (currentVertex.id !== endID) {
            this.updateDistances(currentVertex);
            currentVertex = mygraph.getVertex(this.vertexQueue.pop().value);
        }
        return this.producePath(startID, endID, mygraph);
    }

    /**
     * Initializes data structures for finding paths in the given graph
     * @param mygraph : relevant graph
     */
    Initialize(mygraph: Graph): void {
        this.visited = new Set<number>();
        this.distances = new Map<number, {
            distance: number;
            sourceID: number;
        }>();
        this.vertexQueue = new MinHeap();
    }

    /**
     * Updates the distance map if the distance from given vertex is better than the best known
     * @param currentVertex : relevant vertex
     */
    updateDistances(currentVertex: Vertex): void {
        this.visited.add(currentVertex.id);
        const currentDistance = this.distances.get(currentVertex.id).distance;
        for (const neighbor of currentVertex.neighbors) {
            if (this.visited.has(neighbor.vertex.id)) {
                continue;
            }
            const newDistance = currentDistance + neighbor.costs.distance;
            const oldDistanceEntry = this.distances.get(neighbor.vertex.id);
            if (oldDistanceEntry === undefined || oldDistanceEntry.distance > newDistance) {
                this.distances.set(neighbor.vertex.id, {distance: newDistance, sourceID: currentVertex.id});
                this.vertexQueue.push( newDistance, neighbor.vertex.id);
            }
        }
    }

    /**
     * Produces an object representing the path from startID to endID based on the distance map
     * @param startID : ID of starting vertex
     * @param endID : ID of destination vertex
     */
    producePath(startID: number, endID: number, mygraph: Graph): Path {
        const path: Path = new Path();
        let lastVertex: Vertex = mygraph.getVertex(endID);
        let currentVertex = lastVertex;
        path.addFront(lastVertex, null);
        while (currentVertex.id !== startID) {
            currentVertex = mygraph.getVertex(this.distances.get(currentVertex.id).sourceID);
            path.addFront(currentVertex, currentVertex.costTo(lastVertex));
            lastVertex = currentVertex;
        }
        return path;
    }
}
