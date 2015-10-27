export function vec3(x = 0, y = 0, z = 0) {
    return {x, y, z};
}

Object.assign(vec3, {
    set(x = 0, y = 0, z = 0, out) {
        out.x = x;
        out.y = y;
        out.z = z;

        return out;
    },
    copy(v, out = vec3()) {
        out.x = v.x;
        out.y = v.y;
        out.z = v.z;

        return out;
    },
    add(a, b, out = vec3()) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;

        return out;
    },
    subtract(a, b, out = vec3()) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;

        return out;
    },
    scale(v, s, out = vec3()) {
        out.x = v.x * s;
        out.y = v.y * s;
        out.z = v.z * s;

        return out;
    },
    normalize(v, out = vec3()) {
        let len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        len = len === 0 ? len : 1 / len;
        out.x = v.x * len;
        out.y = v.y * len;
        out.z = v.z * len;

        return out;
    },
    lerp(a, b, t, out = vec3()) {
        if (t === 1) return vec3.copy(b, out);
        else if (t === 0) return vec3.copy(a, out);

        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);

        return out;
    },
    dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    },
    cross(a, b, out = vec3()) {
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;

        return out;
    },
    len(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    },
    len2(v) {
        return v.x * v.x + v.y * v.y + v.z * v.z;
    },
    dist(a, b) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;

        return Math.sqrt(x * x + y * y + z * z);
    },
    dist2(a, b) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;

        return x * x + y * y + z * z;
    }
});

export function quat(w = 1, x = 0, y = 0, z = 0) {
    return {w, x, y, z};
}

Object.assign(quat, {
    set(w, x, y, z, out) {
        out.w = w;
        out.x = x;
        out.y = y;
        out.z = z;

        return out;
    },
    copy(q, out = quat()) {
        out.w = q.w;
        out.x = q.x;
        out.y = q.y;
        out.z = q.z;

        return out;
    },
    add(a, b, out = quat()) {
        out.w = a.w + b.w;
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;

        return out;
    },
    subtract(a, b, out = quat()) {
        out.w = a.w - b.w;
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;

        return out;
    },
    multiply(a, b, out = quat()) {
        const w1 = a.w || 0;
        const x1 = a.x;
        const y1 = a.y;
        const z1 = a.z;

        const w2 = b.w || 0;
        const x2 = b.x;
        const y2 = b.y;
        const z2 = b.z;

        out.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
        out.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
        out.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
        out.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;

        return out;
    },
    scale(q, s, out = quat()) {
        out.w = q.w * s;
        out.x = q.x * s;
        out.y = q.y * s;
        out.z = q.z * s;

        return out;
    },
    conjugate(q, out = quat()) {
        out.w = q.w;
        out.x = -q.x;
        out.y = -q.y;
        out.z = -q.z;

        return out;
    },
    normalize(q, out = quat()) {
        let len = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
        len = len === 0 ? len : 1 / len;
        out.w = q.w * len;
        out.x = q.x * len;
        out.y = q.y * len;
        out.z = q.z * len;

        return out;
    },
    slerp(a, b, t, out = quat()) {
        if (t === 1) return quat.copy(out, b);
        else if (t === 0) return quat.copy(out, a);

        const aw = a.w;
        const ax = a.x;
        const ay = a.y;
        const az = a.z;

        const bw = b.w;
        const bx = b.x;
        const by = b.y;
        const bz = b.z;

        const cosomega = aw * bw + ax * bx + ay * by + az * bz;

        let scaleFrom;
        let scaleTo;
        if (cosomega < 0.9999) {
            const omega = Math.acos(cosomega);
            const sinomega = Math.sin(omega);
            scaleFrom = Math.sin((1.0 - t) * omega) / sinomega;
            scaleTo = Math.sin(t * omega) / sinomega;
        }
        else {
            scaleFrom = 1.0 - t;
            scaleTo = t;
        }

        out.w = aw * scaleFrom + bw * scaleTo;
        out.x = ax * scaleFrom + bx * scaleTo;
        out.y = ay * scaleFrom + by * scaleTo;
        out.z = az * scaleFrom + bz * scaleTo;

        return out;
    },
    nlerp(a, b, t, out = quat()) {
        if (t === 1) return quat.copy(b, out);
        else if (t === 0) return quat.copy(a, out);

        const w = a.w + t * (b.w - a.w);
        const x = a.x + t * (b.x - a.x);
        const y = a.y + t * (b.y - a.y);
        const z = a.z + t * (b.z - a.z);
        let len = w * w + x * x + y * y + z * z;
        len = 1 / len;

        out.w = w * len;
        out.x = x * len;
        out.y = y * len;
        out.z = z * len;

        return out;
    },
    dot(a, b) {
        return a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
    },
    fromEuler(x, y, z, out = quat()) {
        const hx = x * 0.5;
        const hy = y * 0.5;
        const hz = z * 0.5;

        const sx = Math.sin(hx);
        const sy = Math.sin(hy);
        const sz = Math.sin(hz);
        const cx = Math.cos(hx);
        const cy = Math.cos(hy);
        const cz = Math.cos(hz);

        out.w = cx * cy * cz - sx * sy * sz;
        out.x = sx * cy * cz + cx * sy * sz;
        out.y = cx * sy * cz - sx * cy * sz;
        out.z = cx * cy * sz + sx * sy * cz;

        return out;
    },
    fromAngleAxis(v, out = quat()) {
        const theta = v.x * v.x + v.y * v.y + v.z * v.z;
        const ht = 0.5 * theta;
        const s = Math.sin(ht) / theta;

        out.w = Math.cos(ht);
        out.x = v.x * s;
        out.y = v.y * s;
        out.z = v.z * s;

        return out;
    },
    toAngleAxis(q, out = vec3()) {
        let theta;
        let s;
        if (Math.abs(q.w) < 1) {
            theta = 2 * Math.acos(q.w);
            s = theta / Math.sqrt(1 - q.w * q.w);
        }
        else {
            s = theta = 0;
        }

        out.x = q.x * s;
        out.y = q.y * s;
        out.z = q.z * s;

        return out;
    },
    fromVectors(a, b, out = quat()) {
        vec3.cross(a, b, out);
        out.w = Math.sqrt(vec3.len2(a) * vec3.len2(b)) + vec3.dot(a, b);

        return quat.normalize(out, out);
    }
});

export function transform(options, out = Array(16)) {
    if (options.rotation) {
        const q = options.rotation;
        const wx = q.w * q.x;
        const wy = q.w * q.y;
        const wz = q.w * q.z;
        const xx = q.x * q.x;
        const yy = q.y * q.y;
        const zz = q.z * q.z;
        const xy = q.x * q.y;
        const xz = q.x * q.z;
        const yz = q.y * q.z;

        const rs11 = 1 - 2 * (yy + zz);
        const rs12 = 2 * (xy + wz);
        const rs13 = 2 * (xz - wy);
        const rs21 = 2 * (xy - wz);
        const rs22 = 1 - 2 * (xx + zz);
        const rs23 = 2 * (yz + wx);
        const rs31 = 2 * (xz + wy);
        const rs32 = 2 * (yz - wx);
        const rs33 = 1 - 2 * (xx + yy);

        out[0] = rs11;
        out[1] = rs12;
        out[2] = rs13;
        out[4] = rs21;
        out[5] = rs22;
        out[6] = rs23;
        out[8] = rs31;
        out[9] = rs32;
        out[10] = rs33;
    }
    else {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
    }

    if (options.position) {
        const p = options.position;
        out[12] = p.x;
        out[13] = p.y;
        out[14] = p.z;
    }
    else {
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
    }

    out[3] = 0;
    out[7] = 0;
    out[11] = 0;
    out[15] = 1;

    return out;
}

export const vec3Register = vec3();
export const quatRegister = quat();
export const zeroVec = vec3();
export const unitQuat = quat();
