import {vec3, quat, vec3Register, quatRegister, unitQuat, transform} from './math';
export * from './math';

export default class System {
    constructor() {
        this.bodies = new Set();
        this.last = 0;
    }

    step(delta = 1 / 60) {
        constraints(this.bodies, delta);
        forces(this.bodies, delta);
        verlet(this.bodies, delta);
    }

    body(options) {
        const b = new SystemBody(options);
        this.bodies.add(b);
        return b;
    }
}

function forces(bodies, delta) {
    for (let body of bodies) {
        vec3.set(0, 0, 0, body.acceleration);
        for (let force of body.forces) vec3.add(body.acceleration, force(), body.acceleration);
        vec3.set(0, 0, 0, body.torque);
        for (let torque of body.torques) vec3.add(body.torque, torque(), body.torque);
    }
}

function verlet(bodies, delta) {
    const invDt = 1 / delta;
    const deltaSq = delta * delta;
    const hDeltaSq = 0.5 * deltaSq;

    for (let body of bodies) {
        // Temporarily store current position state
        vec3.copy(body.position, vec3Register);
        if (body.translates) {
            // Use .lastPosition as a register for vec3 math
            const tempVec3 = body.lastPosition;
            vec3.subtract(body.position, body.lastPosition, tempVec3);
            vec3.lerp(tempVec3, body.positionDelta, body.interpolation, tempVec3);
            vec3.scale(tempVec3, 1 - body.damping, tempVec3);
            vec3.copy(tempVec3, body.positionDelta);

            if (body.active) {
                vec3.add(body.position, tempVec3, body.position);
                vec3.scale(body.acceleration, deltaSq, tempVec3);
                vec3.add(body.position, tempVec3, body.position);
            }

            vec3.scale(tempVec3, invDt, body.velocity);
        }

        vec3.copy(vec3Register, body.lastPosition);

        // Temporarily store current rotation state
        quat.copy(body.rotation, quatRegister);
        if (body.rotates) {
            // Use .lastRotation as a register for quat math
            const tempQuat = body.lastRotation;
            quat.conjugate(body.lastRotation, tempQuat);
            quat.multiply(body.rotation, tempQuat, tempQuat);
            quat.normalize(tempQuat, tempQuat);
            quat.nlerp(tempQuat, body.rotationDelta, body.interpolation, tempQuat);
            quat.nlerp(unitQuat, tempQuat, 1 - body.angularDamping, tempQuat);
            quat.copy(tempQuat, body.rotationDelta);

            quat.toAngleAxis(tempQuat, body.angularVelocity);
            vec3.scale(body.angularVelocity, invDt, body.angularVelocity);

            if (body.active) {
                quat.multiply(tempQuat, body.rotation, body.rotation);
                quat.multiply(body.rotation, body.torque, tempQuat);
                quat.scale(tempQuat, hDeltaSq, tempQuat);
                quat.add(body.rotation, tempQuat, body.rotation);
                quat.normalize(body.rotation, body.rotation);
            }
        }

        quat.copy(quatRegister, body.lastRotation);
    }
}

function constraints(bodies, delta) {
    for (let i = 0; i < 4; i++) {
        for (let body of bodies) {
            for (let constraint of body.constraints) {
                constraint();
            }
        }
    }
}

class SystemBody {
    constructor({
            position = vec3(),
            rotation = quat(),
            translates = true,
            rotates = true,
            damping = 0,
            angularDamping = 0,
            interpolation = 0
        } = {}) {
        this.position = position;
        this.lastPosition = vec3.copy(position);
        this.positionDelta = vec3();
        this.velocity = vec3();
        this.acceleration = vec3();

        this.rotation = rotation;
        this.lastRotation = quat.copy(rotation);
        this.rotationDelta = quat();
        this.angularVelocity = vec3();
        this.torque = vec3();

        this.translates = translates;
        this.rotates = rotates;
        this.damping = damping;
        this.angularDamping = angularDamping
        this.interpolation = interpolation;

        this.active = true;

        this.forces = new Set();
        this.torques = new Set();

        this.constraints = new Set();

        this.bound = null;
    }

    on() {
        this.active = true;

        return this;
    }

    off() {
        this.active = false;

        return this;
    }

    addForce(force) {
        this.forces.add(force);

        return this;
    }

    removeForce(force) {
        this.forces.delete(force);

        return this;
    }

    addTorque(torque) {
        this.torques.add(torque);

        return this;
    }

    removeTorque(torque) {
        this.torques.delete(torque);

        return this;
    }

    addConstraint(constraint) {
        this.constraints.add(constraint);

        return this;
    }

    removeConstraint(constraint) {
        this.constraints.delete(constraint);

        return this;
    }

    spring(anchor, period = 1, damping = 0.1) {
        const p = this.position;
        const v = this.velocity;
        let k = 2 * Math.PI / period;
        k *= k;
        let d = 4 * Math.PI * damping / period;
        const f = vec3();
        const func = function() {
            vec3.subtract(anchor, p, f);
            vec3.scale(f, k, f);
            vec3.scale(v, -d, vec3Register);
            vec3.add(f, vec3Register, f);

            return f;
        };

        return func;
    }

    torsionSpring(anchor, period = 1, damping = 0.1) {
        const q = this.rotation;
        const w = this.angularVelocity;
        let k = 2 * Math.PI / period;
        k *= k;
        let d = 4 * Math.PI * damping / period;
        const f = vec3();
        const func = function() {
            quat.conjugate(q, quatRegister);
            quat.multiply(anchor, quatRegister, quatRegister);
            quat.toAngleAxis(quatRegister, f);
            vec3.scale(f, k, f);
            vec3.scale(w, -d, vec3Register);
            vec3.add(f, vec3Register, f);

            return f;
        }

        return func;
    }

    springConstraint(anchor, stiffness = 0.05, length = 0) {
        const p = this.position;
        const func = function() {
            if (length > 0) {
                vec3.subtract(p, anchor, vec3Register);
                vec3.normalize(vec3Register, vec3Register);
                vec3.scale(vec3Register, length, vec3Register);
                vec3.add(vec3Register, anchor, vec3Register);
                vec3.lerp(p, vec3Register, stiffness, p);
            }
            else vec3.lerp(p, anchor, stiffness, p);
        };

        return func;
    }

    torsionSpringConstraint(anchor, stiffness = 0.05, angle = 0) {
        const q = this.rotation;
        const func = function() {
            // quat.conjugate(anchor, quatRegister);
            // quat.multiply(q, quatRegister, quatRegister);
            // quat.nlerp(unitQuat, quatRegister, stiffness, quatRegister);
            quat.nlerp(q, anchor, stiffness, q);
        }

        return func;
    }

    pinConstraint(anchor, stiffness = 0.05) {
        const p = this.position;
        const q = this.rotation;

        const diff = vec3.subtract(anchor, p);
        const torsionAnchor = quat.copy(q);
        const torsionSpring = this.torsionSpringConstraint(torsionAnchor, stiffness, 0);

        const length = vec3.dist(anchor, p);
        const spring = this.springConstraint(anchor, stiffness, length);
        const func = function() {
            vec3.subtract(anchor, p, vec3Register);
            quat.fromVectors(diff, vec3Register, quatRegister);

            quat.multiply(quatRegister, torsionAnchor, torsionAnchor);
            vec3.copy(vec3Register, diff);

            spring();
            torsionSpring();
        }

        return func;
    }
}
