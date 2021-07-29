namespace Utils.Vector {
    export function getDistance(A: Vector, B: Vector): number {
        return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2) + Math.pow(A.z - B.z, 2));
    }
}
