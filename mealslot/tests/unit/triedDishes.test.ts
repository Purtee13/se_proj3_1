import { describe, it, expect, beforeEach } from "vitest";

// Simple in-memory store and route helpers for tests
const triedStore = {
    triedDishes: new Map<string, any>(),
    add(userId: string, dishId: string, dishName: string) {
        const id = `tried_${userId}_${dishId}`;
        if (this.triedDishes.has(id)) return null;
        const item = {
            id,
            userId,
            dishId,
            dishName,
            notes: "",
            rating: null,
            dateTried: new Date().toISOString(),
        };
        this.triedDishes.set(id, item);
        return item;
    },
    getByUser(userId: string, dishId?: string) {
        const arr: any[] = [];
        for (const v of this.triedDishes.values()) {
            if (v.userId === userId) {
                if (!dishId || v.dishId === dishId) arr.push(v);
            }
        }
        return arr;
    },
    getById(id: string) {
        return this.triedDishes.get(id) ?? null;
    },
    update(id: string, patch: any) {
        const cur = this.triedDishes.get(id);
        if (!cur) return null;
        const updated = { ...cur, ...patch };
        this.triedDishes.set(id, updated);
        return updated;
    },
    delete(id: string) {
        return this.triedDishes.delete(id);
    },
    clear() {
        this.triedDishes.clear();
    },
};

// Helpers to mimic Request-like objects in tests
const jsonReq = (obj: any) => ({ json: async () => obj });
const jsonPatchReq = (obj: any) => ({ json: async () => obj });

// Route-like helpers returning { status, json() }
async function postTriedRoute(req: any) {
    const body = await req.json();
    const { userId, dishId, dishName } = body;
    if (!userId || !dishId) {
        return { status: 400, json: async () => ({ error: 'missing' }) };
    }
    const item = triedStore.add(userId, dishId, dishName || dishId);
    if (!item) return { status: 409, json: async () => ({ error: 'already exists' }) };
    return { status: 201, json: async () => item };
}

async function getTriedRoute(userId?: string, dishId?: string) {
    if (!userId) return { status: 400, json: async () => ({ error: 'missing userId' }) };
    const data = triedStore.getByUser(userId, dishId);
    return { status: 200, json: async () => data };
}

async function patchTriedRoute(id: string, req: any) {
    const patch = await req.json();
    const existing = triedStore.getById(id);
    if (!existing) return { status: 404, json: async () => ({ error: 'not found' }) };
    const updated = triedStore.update(id, patch);
    return { status: 200, json: async () => updated };
}

async function deleteTriedRoute(id: string) {
    const existed = triedStore.getById(id);
    if (!existed) return { status: 404, json: async () => ({ error: 'not found' }) };
    triedStore.delete(id);
    return { status: 200, json: async () => ({ ok: true }) };
}

describe("Tried Dishes - Core", () => {
    beforeEach(() => triedStore.clear());

    it("stores and retrieves a tried dish", async () => {
        const res = await postTriedRoute(jsonReq({ userId: 'user-1', dishId: 'dish-pizza', dishName: 'Pizza' }));
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.dishId).toBe('dish-pizza');

        const list = await getTriedRoute('user-1');
        const listData = await list.json();
        expect(Array.isArray(listData)).toBe(true);
        expect(listData.length).toBe(1);
        expect(listData[0].dishId).toBe('dish-pizza');
    });

    it("returns empty array for non-tried dish", async () => {
        const res = await getTriedRoute('user-1', 'dish-none');
        const data = await res.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(0);
    });

    it("stores timestamp when dish is marked as tried", async () => {
        const before = Date.now();
        const res = await postTriedRoute(jsonReq({ userId: 'user-1', dishId: 'dish-pizza' }));
        const data = await res.json();
        const dt = new Date(data.dateTried).getTime();
        expect(dt).toBeGreaterThanOrEqual(before);
    });
});

describe("Tried Dishes - Review & Rating", () => {
    let triedId: string;
    beforeEach(async () => {
        triedStore.clear();
        const res = await postTriedRoute(jsonReq({ userId: 'user-1', dishId: 'dish-pizza', dishName: 'Pizza' }));
        const data = await res.json();
        triedId = data.id;
    });

    it('adds notes to a tried dish', async () => {
        const res = await patchTriedRoute(triedId, jsonPatchReq({ notes: 'Delicious!' }));
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.notes).toBe('Delicious!');
    });

    it('adds rating to a tried dish', async () => {
        const res = await patchTriedRoute(triedId, jsonPatchReq({ rating: 4.5 }));
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.rating).toBe(4.5);
    });

    it('returns 404 when patching non-existent tried dish', async () => {
        const res = await patchTriedRoute('no-id', jsonPatchReq({ notes: 'x' }));
        expect(res.status).toBe(404);
    });
});

describe('Tried Dishes - Deletion', () => {
    let id: string;
    beforeEach(async () => {
        triedStore.clear();
        const r = await postTriedRoute(jsonReq({ userId: 'u1', dishId: 'pizza' }));
        const d = await r.json();
        id = d.id;
    });

    it('deletes a tried dish', async () => {
        const res = await deleteTriedRoute(id);
        expect(res.status).toBe(200);
        const list = await getTriedRoute('u1');
        const data = await list.json();
        expect(data.length).toBe(0);
    });

    it('returns 404 when deleting non-existent id', async () => {
        const res = await deleteTriedRoute('nope');
        expect(res.status).toBe(404);
    });
});

const dishes = ["pizza", "burger", "sushi"];
const triedIds: string[] = [];

for (const dishId of dishes) {
    const res = await postTriedRoute(
        jsonReq({
            userId: "user-1",
            dishId,
            dishName: dishId,
        })
    );
    const data = await res.json();
    triedIds.push(data.id);
}

// Add reviews to each
const reviews = ["Amazing!", "Very good", "Perfect"];
const ratings = [5, 4, 5];

for (let i = 0; i < triedIds.length; i++) {
    const updateRes = await patchTriedRoute(
        triedIds[i],
        jsonPatchReq({
            notes: reviews[i],
            rating: ratings[i],
        })
    );
    expect(updateRes.status).toBe(200);
}

// Verify all reviews are saved
const allTriedRes = await getTriedRoute("user-1");
const allTriedData = await allTriedRes.json();
expect(allTriedData.every((item: any) => item.notes && item.rating)).toBe(true);
    });

it("handles deletion of some tried dishes while keeping others", async () => {
    const dishes = ["pizza", "burger", "sushi"];
    const triedIds: string[] = [];

    for (const dishId of dishes) {
        const res = await postTriedRoute(
            jsonReq({
                userId: "user-1",
                dishId,
                dishName: dishId,
            })
        );
        const data = await res.json();
        triedIds.push(data.id);
    }

    // Delete middle one
    await deleteTriedRoute(triedIds[1]);

    // Check remaining
    const res = await getTriedRoute("user-1");
    const data = await res.json();
    expect(data.length).toBe(2);
    expect(data.map((d: any) => d.dishId)).toContain("pizza");
    expect(data.map((d: any) => d.dishId)).toContain("sushi");
});

it("tracks tried dishes across party spins", async () => {
    // Simulate party spin results
    const spinResults = [
        { dishId: "pizza-1", name: "Pepperoni" },
        { dishId: "burger-1", name: "Classic Burger" },
        { dishId: "pasta-1", name: "Penne Arrabbiata" },
    ];

    // All party members mark spun dishes as tried
    for (const dish of spinResults) {
        await postTriedRoute(
            jsonReq({
                userId: "user-1",
                dishId: dish.dishId,
                dishName: dish.name,
            })
        );
    }

    // Verify all spin results are in tried
    const res = await getTriedRoute("user-1");
    const data = await res.json();
    expect(data.length).toBe(3);
    expect(data.map((d: any) => d.dishId)).toEqual([
        "pizza-1",
        "burger-1",
        "pasta-1",
    ]);
});

it("verifies dish status across multi-category selections", async () => {
    const categories = {
        breakfast: ["pancakes", "eggs", "bacon"],
        lunch: ["sandwich", "salad", "soup"],
        dinner: ["steak", "salmon", "chicken"],
    };

    // Mark some dishes as tried
    const triedDishes = ["pancakes", "sandwich", "salmon"];

    for (const dish of triedDishes) {
        await postTriedRoute(
            jsonReq({
                userId: "user-1",
                dishId: dish,
                dishName: dish,
            })
        );
    }

    // Check status of all dishes in a category
    for (const dish of categories.breakfast) {
        const res = await getTriedRoute("user-1", dish);
        const data = await res.json();
        if (triedDishes.includes(dish)) {
            expect(data.length).toBeGreaterThan(0);
        } else {
            expect(data.length).toBe(0);
        }
    }
});
});
