const BASE_URL = 'http://localhost:5000/api';

async function test() {
    try {
        console.log('--- STARTING TEST ---');

        // 1. Create a New User
        const randomNum = Math.floor(Math.random() * 10000);
        const newUserEmail = `auto_test_${randomNum}@example.com`;

        console.log(`Creating user: ${newUserEmail}`);
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Auto Test User',
                email: newUserEmail,
                password: 'password123',
                department: 'Testing',
                role: 'user'
            })
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
            console.error('Registration Failed:', regData);
            return;
        }

        const newUser = regData.user;
        const newToken = regData.token;
        console.log('User Created Successfully.');
        console.log(`Generated ID: ${newUser.employeeId}`);

        if (!newUser.employeeId.startsWith('A-')) {
            console.error('FAIL: ID format incorrect. Expected A-XXX');
        } else {
            console.log('PASS: ID format correct.');
        }

        // 2. Login as Admin to Assign Asset
        console.log('\nLogging in as Admin...');
        const adminRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'password123' })
        });
        const adminData = await adminRes.json();
        const adminToken = adminData.token;

        // Find an available asset
        const assetsRes = await fetch(`${BASE_URL}/assets`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const assetsData = await assetsRes.json();
        const availableAsset = assetsData.data.find(a => a.status === 'Available');

        if (!availableAsset) {
            console.warn('SKIP: No available asset to assign for dashboard verification.');
        } else {
            console.log(`Assigning Asset ${availableAsset.assetId} to new user...`);

            const assignRes = await fetch(`${BASE_URL}/allocations/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    assetId: availableAsset._id,
                    assignedTo: newUser._id, // Use the ID from registration response
                    remarks: 'Auto verification'
                })
            });

            if (assignRes.ok) {
                console.log('Assignment Successful.');

                // 3. Check New User Dashboard
                console.log('\nChecking New User Dashboard...');
                const myAssetsRes = await fetch(`${BASE_URL}/assets/my-assets`, {
                    headers: { Authorization: `Bearer ${newToken}` }
                });
                const myAssetsData = await myAssetsRes.json();

                console.log(`User found ${myAssetsData.count} assets.`);
                if (myAssetsData.count > 0 && myAssetsData.data[0]._id === availableAsset._id) {
                    console.log('PASS: Asset correctly displayed in user dashboard.');
                } else {
                    console.error('FAIL: Asset not found in user dashboard.');
                }

            } else {
                const err = await assignRes.json();
                console.error('Assignment Failed:', err);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
