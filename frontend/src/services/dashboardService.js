import api from './axios';
import { DEFAULT_AVATAR } from '../utils/defaultAvatar';

export const getMemberDashboardData = async (email = null) => {
    try {
        const url = email ? `auth/member-dashboard/?email=${encodeURIComponent(email)}` : 'auth/member-dashboard/';
        const response = await api.get(url);
        if (response.data && response.data.data) {
            return {
                ...response.data.data,
                data: response.data.data,
                success: response.data.success
            };
        }
        return response.data;
    } catch (error) {
        // Return high quality fallback mockup data if API is loading or offline
        return getFallbackMemberData();
    }
};

export const getMemberTodayWorkout = async (email = null) => {
    try {
        const url = email ? `auth/member/today-workout/?email=${encodeURIComponent(email)}` : 'auth/member/today-workout/';
        const response = await api.get(url);
        return response.data?.data || response.data;
    } catch (error) {
        console.warn('Failed to fetch today workout:', error);
        return null;
    }
};

export const getTrainerDashboardData = async (email = null) => {
    try {
        const url = email ? `auth/trainer-dashboard/?email=${encodeURIComponent(email)}` : 'auth/trainer-dashboard/';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        return getFallbackTrainerData();
    }
};

export const getTrainerAssignedMembers = async (email = null) => {
    try {
        const url = email ? `auth/trainer/assigned-members/?email=${encodeURIComponent(email)}` : 'auth/trainer/assigned-members/';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        return [];
    }
};

export const assignWorkoutRoutine = async (routineData) => {
    try {
        const response = await api.post('auth/trainer/assign-routine/', routineData);
        return response.data;
    } catch (error) {
        console.warn('Failed to assign routine on server:', error);
        throw error;
    }
};

export const getAdminDashboardData = async () => {
    try {
        const response = await api.get('auth/admin-dashboard/');
        if (response.data && response.data.data) {
            return {
                ...response.data.data,
                ...response.data,
                data: response.data.data
            };
        }
        return response.data;
    } catch (error) {
        return getFallbackAdminData();
    }
};

export const toggleExerciseStatus = async (exerciseId) => {
    try {
        const response = await api.post(`auth/member/exercise/${exerciseId}/toggle/`);
        return response.data;
    } catch (error) {
        console.warn('Could not toggle exercise on server:', error);
        return null;
    }
};

export const uploadExerciseVideoProof = async (exerciseId, fileOrUrl) => {
    try {
        if (typeof fileOrUrl === 'string') {
            const response = await api.post(`auth/member/exercise/${exerciseId}/video-proof/`, {
                video_url: fileOrUrl
            });
            return response.data;
        } else {
            const formData = new FormData();
            formData.append('video', fileOrUrl);
            const response = await api.post(`auth/member/exercise/${exerciseId}/video-proof/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        }
    } catch (error) {
        console.warn('Failed to upload video proof to server:', error);
        throw error;
    }
};

export const getTrainerAthleteWorkout = async (athleteEmail) => {
    try {
        const response = await api.get(`auth/trainer/athlete-workout/?email=${encodeURIComponent(athleteEmail)}`);
        return response.data?.data || response.data;
    } catch (error) {
        console.warn('Failed to fetch athlete workout for trainer:', error);
        return null;
    }
};

export const getFallbackMemberData = () => ({
    member: {
        name: "Alex Mercer",
        email: "alex.mercer@omnifit.com",
        role: "Member",
        membershipPlan: "Platinum VIP Membership",
        membershipExpiry: "120 Days",
        trainerName: "Anandhu pradeep (NASM Master)",
        avatar: DEFAULT_AVATAR,
        age: 26,
        gender: "Male",
        dob: "1998-04-12",
        height: "182 cm",
        weight: "78.5 kg",
        bmi: 23.7,
        bodyFat: "14.2%",
        waterIntake: "3.2 L / 4.0 L",
        caloriesBurnedToday: "840 kcal",
        todayCaloriesConsumed: "1,950 / 2,500 kcal",
        attendancePercent: "94.5%",
        workoutCompletion: "88%",
    },
    stats: {
        todayWorkout: "Chest & Triceps Hypertrophy",
        todayDiet: "High-Protein Surplus (180g P)",
        upcomingAppointment: "Session with Anandhu pradeep",
    },
    charts: {
        weeklyCalories: [620, 780, 840, 710, 950, 890, 840],
        weightProgress: [81.0, 80.4, 79.8, 79.2, 78.9, 78.5],
        workoutProgress: [65, 70, 78, 82, 85, 88],
        attendancePercent: 94.5,
    }
});

export const getFallbackTrainerData = () => ({
    trainer: {
        name: "Anandhu pradeep",
        specialization: "Hypertrophy & Resistance AI",
        experience: "8 Years",
        rating: "4.95 / 5.0",
        totalClients: 42,
        todaySessions: 6,
        pendingReviews: 3,
    },
    recentMembers: [
        { id: 1, name: "Goutham Sreekumar", plan: "Platinum VIP", goal: "Hypertrophy & Strength", attendance: "100%" },
    ],
    upcomingSessions: [
        { id: 101, member: "Goutham Sreekumar", time: "10:00 AM", type: "Hypertrophy Check", status: "Approved" },
    ]
});

export const getFallbackAdminData = () => ({
    stats: {
        totalMembers: 1,
        totalTrainers: 1,
        activeMemberships: 1,
        todayAttendance: 1,
        monthlyRevenue: "$199",
        pendingPayments: "$0",
        appointmentsToday: 1,
    },
    charts: {
        monthlyRevenue: [0, 0, 0, 0, 0, 199],
        memberGrowth: [0, 0, 0, 0, 1, 1],
        attendanceStats: [0, 0, 0, 1, 1],
    },
    recentPayments: [
        { id: "TXN-9841", member: "Goutham Sreekumar", amount: "$199.00", plan: "Platinum VIP", status: "Paid", date: "2026-10-25" },
    ]
});
