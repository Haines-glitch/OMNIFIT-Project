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

export const getFallbackMemberData = () => ({
    member: {
        name: "Alex Mercer",
        email: "alex.mercer@omnifit.com",
        role: "Member",
        membershipPlan: "Platinum VIP Membership",
        membershipExpiry: "120 Days",
        trainerName: "Marcus Vance (NASM Master)",
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
        upcomingAppointment: "Tomorrow @ 10:00 AM with Marcus",
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
        name: "Marcus Vance",
        specialization: "Hypertrophy & Resistance AI",
        experience: "8 Years",
        rating: "4.95 / 5.0",
        totalClients: 42,
        todaySessions: 6,
        pendingReviews: 3,
    },
    recentMembers: [
        { id: 1, name: "Sarah Jenkins", plan: "Gold Fitness", goal: "Endurance & Cardio", attendance: "95%" },
        { id: 2, name: "Michael Scott", plan: "Silver Basic", goal: "Weight Management", attendance: "95%" },
    ],
    upcomingSessions: [
        { id: 101, member: "Sarah Jenkins", time: "10:00 AM", type: "Cardio & Endurance Check", status: "Approved" },
        { id: 102, member: "Michael Scott", time: "02:30 PM", type: "Weight Management Audit", status: "Pending" },
    ]
});

export const getFallbackAdminData = () => ({
    stats: {
        totalMembers: 1248,
        totalTrainers: 34,
        activeMemberships: 1180,
        todayAttendance: 342,
        monthlyRevenue: "$48,920",
        pendingPayments: "$1,450",
        appointmentsToday: 28,
    },
    charts: {
        monthlyRevenue: [32000, 35400, 41200, 39800, 44500, 48920],
        memberGrowth: [800, 910, 1020, 1100, 1180, 1248],
        attendanceStats: [280, 310, 295, 330, 342],
    },
    recentPayments: [
        { id: "TXN-9841", member: "Alex Mercer", amount: "$199.00", plan: "Platinum VIP", status: "Paid", date: "2026-08-05" },
        { id: "TXN-9842", member: "Sarah Jenkins", amount: "$129.00", plan: "Gold Fitness", status: "Paid", date: "2026-08-05" },
        { id: "TXN-9843", member: "Michael Scott", amount: "$89.00", plan: "Silver Basic", status: "Pending", date: "2026-08-04" },
        { id: "TXN-9844", member: "Elena Rostova", amount: "$199.00", plan: "Platinum VIP", status: "Paid", date: "2026-08-04" },
    ]
});
