const fs = require('fs');
const http = require('http');

async function testComplaint() {
    // 1. Send OTP
    const sendData = JSON.stringify({
        mobile: '9999999999',
        kioskId: '21f4426e-c6c7-43a6-a528-bc3d9b391128',
        ulbId: 'b99ef3ad-870d-4523-a797-fdbed0f09026'
    });

    console.log("Sending OTP...");
    const sendRes = await new Promise(resolve => {
        const req = http.request('http://localhost:3000/api/auth/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.write(sendData);
        req.end();
    });

    console.log("OTP Send Result:", sendRes);

    // Wait 1s for Docker logs
    await new Promise(r => setTimeout(r, 1000));

    // Get OTP from logs
    const { execSync } = require('child_process');
    const logs = execSync('docker logs --tail 20 suvidha-auth').toString();
    const otpMatch = logs.match(/OTP for .*?: (\d{6})/);
    if (!otpMatch) {
        console.log("Could not find OTP in logs!");
        return;
    }
    const otp = otpMatch[1];
    console.log("Found OTP:", otp);

    // 2. Verify OTP
    const verifyData = JSON.stringify({
        mobile: '9999999999',
        otp,
        kioskId: '21f4426e-c6c7-43a6-a528-bc3d9b391128',
        ulbId: 'b99ef3ad-870d-4523-a797-fdbed0f09026'
    });

    console.log("Verifying OTP...");
    const verifyRes = await new Promise(resolve => {
        const req = http.request('http://localhost:3000/api/auth/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.write(verifyData);
        req.end();
    });

    console.log("Verify Result: success=", verifyRes.success);
    const token = verifyRes.token;

    if (!token) return console.log("Failed to get token", verifyRes);

    console.log("Got Token:", token.slice(0, 20) + '...');

    // 3. Register Complaint (Checkpoint 3)
    const complaintData = JSON.stringify({
        categoryId: "8da14ab4-945d-45cd-b2fa-77d7e816bfa1", // WATER_SUPPLY
        wardId: "e1e5c4a5-6a7f-4b89-a2e1-abc123456789",
        location: {
            address: "123 Main St",
            lat: 18.5204,
            lng: 73.8567
        },
        description: "Major gas leak near the intersection", // "gas leak" triggers EMERGENCY
        imageUrls: [],
        reporterName: "John Doe",
        reporterMobile: "9999999999"
    });

    console.log("Submitting complaint...");
    const complaintRes = await new Promise(resolve => {
        const req = http.request('http://localhost:3000/api/complaints', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.write(complaintData);
        req.end();
    });

    console.log("Complaint Response:", complaintRes);
}

testComplaint();
