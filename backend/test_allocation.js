const BASE_URL = 'http://localhost:5000/api';

async function test() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        console.log('Login successful. Token acquired.');

        // 2. Get Assets
        console.log('Fetching Assets...');
        const assetsRes = await fetch(`${BASE_URL}/assets`, { headers });
        const assetsData = await assetsRes.json();
        const assets = assetsData.data;
        console.log(`Fetched ${assets.length} assets.`);

        const availableAssets = assets.filter(a => a.status === 'Available');
        console.log(`${availableAssets.length} available assets.`);

        if (availableAssets.length === 0) {
            console.error('No available assets to assign.');
            return;
        }

        const assetId = availableAssets[0]._id;
        console.log(`Selected Asset ID: ${assetId} (${availableAssets[0].assetId})`);

        // 3. Get Users
        console.log('Fetching Users...');
        const usersRes = await fetch(`${BASE_URL}/users`, { headers });
        const usersData = await usersRes.json();
        const users = usersData.data;
        console.log(`Fetched ${users.length} users.`);

        if (users.length === 0) {
            console.error('No users found.');
            return;
        }

        const userId = users[1]._id; // Pick second user
        console.log(`Selected User ID: ${userId} (${users[1].name})`);

        // 4. Assign Asset
        console.log('Attempting to Assign Asset...');
        const assignRes = await fetch(`${BASE_URL}/allocations/assign`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                assetId: assetId,
                assignedTo: userId,
                remarks: 'Test assignment via script'
            })
        });

        const assignData = await assignRes.json();
        console.log('Assignment Response:', assignData);

        if (!assignRes.ok) {
            console.error('FAILED:', assignData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
