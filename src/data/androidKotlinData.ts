export interface AndroidFile {
  fileName: string;
  filePath: string;
  language: 'kotlin' | 'xml' | 'json' | 'groovy';
  description: string;
  category: 'ui' | 'viewmodel' | 'network' | 'model' | 'database' | 'config';
  code: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    fileName: 'MainActivity.kt',
    filePath: 'app/src/main/java/com/campuspulse/app/MainActivity.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Main Android Activity hosting Jetpack Compose Navigation, dynamic theming, and edge-to-edge layout',
    code: `package com.campuspulse.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.campuspulse.app.ui.navigation.CampusNavGraph
import com.campuspulse.app.ui.theme.CampusPulseTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CampusPulseTheme {
                val navController = rememberNavController()
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CampusNavGraph(navController = navController)
                }
            }
        }
    }
}`,
  },
  {
    fileName: 'AIAssistantScreen.kt',
    filePath: 'app/src/main/java/com/campuspulse/app/ui/screens/ai/AIAssistantScreen.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Jetpack Compose AI Assistant UI with Gemini streaming chat, prompt chips, and markdown renderer',
    code: `package com.campuspulse.app.ui.screens.ai

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AIAssistantScreen(
    viewModel: AIAssistantViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var inputText by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(Modifier.width(8.dp))
                        Text("CampusPulse AI Tutor")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surfaceColorAtElevation(3.dp)
                )
            )
        },
        bottomBar = {
            Surface(tonalElevation = 6.dp) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = inputText,
                        onValueChange = { inputText = it },
                        placeholder = { Text("Ask about exams, code, concepts...") },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(24.dp),
                        maxLines = 4
                    )
                    Spacer(Modifier.width(8.dp))
                    IconButton(
                        onClick = {
                            if (inputText.isNotBlank()) {
                                viewModel.sendMessage(inputText)
                                inputText = ""
                            }
                        },
                        colors = IconButtonDefaults.filledIconButtonColors()
                    ) {
                        Icon(Icons.Default.Send, contentDescription = "Send Query")
                    }
                }
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text(
                    "Suggested Questions:",
                    style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier.padding(top = 8.dp)
                )
                // Quick Suggestion Chips
                PromptSuggestionChips(
                    onSelect = { prompt ->
                        viewModel.sendMessage(prompt)
                    }
                )
            }

            items(uiState.messages) { message ->
                ChatMessageItem(message = message)
            }

            if (uiState.isLoading) {
                item {
                    CircularProgressIndicator(
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
        }
    }
}`,
  },
  {
    fileName: 'StudentViewModel.kt',
    filePath: 'app/src/main/java/com/campuspulse/app/viewmodel/StudentViewModel.kt',
    language: 'kotlin',
    category: 'viewmodel',
    description: 'MVVM ViewModel managing student profile, timetable, assignments, events, and notifications with StateFlow',
    code: `package com.campuspulse.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.campuspulse.app.data.repository.CampusRepository
import com.campuspulse.app.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class StudentViewModel @Inject constructor(
    private val campusRepository: CampusRepository
) : ViewModel() {

    private val _dashboardState = MutableStateFlow<DashboardUiState>(DashboardUiState.Loading)
    val dashboardState: StateFlow<DashboardUiState> = _dashboardState.asStateFlow()

    init {
        loadDashboardData()
    }

    fun loadDashboardData() {
        viewModelScope.launch {
            _dashboardState.value = DashboardUiState.Loading
            try {
                val student = campusRepository.getStudentProfile()
                val schedule = campusRepository.getTodaySchedule()
                val announcements = campusRepository.getAnnouncements()
                val pendingAssignments = campusRepository.getPendingAssignments()
                val upcomingEvents = campusRepository.getFeaturedEvents()

                _dashboardState.value = DashboardUiState.Success(
                    student = student,
                    schedule = schedule,
                    announcements = announcements,
                    assignments = pendingAssignments,
                    events = upcomingEvents
                )
            } catch (e: Exception) {
                _dashboardState.value = DashboardUiState.Error(e.localizedMessage ?: "Network error")
            }
        }
    }

    fun registerForEvent(eventId: String) {
        viewModelScope.launch {
            campusRepository.registerForEvent(eventId)
            loadDashboardData()
        }
    }

    fun completeAssignment(assignmentId: String) {
        viewModelScope.launch {
            campusRepository.markAssignmentCompleted(assignmentId)
            loadDashboardData()
        }
    }
}

sealed interface DashboardUiState {
    object Loading : DashboardUiState
    data class Success(
        val student: StudentProfile,
        val schedule: List<ClassScheduleItem>,
        val announcements: List<Announcement>,
        val assignments: List<Assignment>,
        val events: List<CampusEvent>
    ) : DashboardUiState
    data class Error(val message: String) : DashboardUiState
}`,
  },
  {
    fileName: 'CampusApiService.kt',
    filePath: 'app/src/main/java/com/campuspulse/app/data/remote/CampusApiService.kt',
    language: 'kotlin',
    category: 'network',
    description: 'Retrofit 2 REST API Service defining endpoints for Student, Events, Resources, and Gemini AI queries',
    code: `package com.campuspulse.app.data.remote

import com.campuspulse.app.model.*
import retrofit2.Response
import retrofit2.http.*

interface CampusApiService {

    @GET("api/student/profile")
    suspend fun getProfile(): Response<StudentProfile>

    @GET("api/schedule/today")
    suspend fun getTodaySchedule(): Response<List<ClassScheduleItem>>

    @GET("api/announcements")
    suspend fun getAnnouncements(): Response<List<Announcement>>

    @GET("api/events")
    suspend fun getEvents(@Query("category") category: String? = null): Response<List<CampusEvent>>

    @POST("api/events/{id}/register")
    suspend fun registerEvent(@Path("id") eventId: String): Response<EventRegistrationResponse>

    @GET("api/resources")
    suspend fun getResources(
        @Query("subject") subject: String? = null,
        @Query("semester") semester: Int? = null
    ): Response<List<StudyResource>>

    @GET("api/assignments")
    suspend fun getAssignments(@Query("status") status: String? = null): Response<List<Assignment>>

    @PATCH("api/assignments/{id}/status")
    suspend fun updateAssignmentStatus(
        @Path("id") id: String,
        @Body body: Map<String, String>
    ): Response<Assignment>

    @POST("api/ai/assistant")
    suspend fun queryAiAssistant(@Body request: AiChatRequest): Response<AiChatResponse>
}

data class AiChatRequest(
    val message: String,
    val context: StudentContextPayload? = null
)

data class AiChatResponse(
    val reply: String,
    val source: String
)`,
  },
  {
    fileName: 'AppDatabase.kt',
    filePath: 'app/src/main/java/com/campuspulse/app/data/local/AppDatabase.kt',
    language: 'kotlin',
    category: 'database',
    description: 'Room SQLite Database for offline-first caching of student schedule, assignments, and downloaded resources',
    code: `package com.campuspulse.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.campuspulse.app.data.local.dao.*
import com.campuspulse.app.data.local.entity.*

@Database(
    entities = [
        StudentEntity::class,
        ScheduleEntity::class,
        AssignmentEntity::class,
        ResourceEntity::class,
        NotificationEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun studentDao(): StudentDao
    abstract fun scheduleDao(): ScheduleDao
    abstract fun assignmentDao(): AssignmentDao
    abstract fun resourceDao(): ResourceDao
    abstract fun notificationDao(): NotificationDao
}`,
  },
  {
    fileName: 'FirebaseMessagingService.kt',
    filePath: 'app/src/main/java/com/campuspulse/app/service/CampusFirebaseMessagingService.kt',
    language: 'kotlin',
    category: 'config',
    description: 'Firebase Cloud Messaging (FCM) push notification handler for exam alerts, assignment deadlines, and event passes',
    code: `package com.campuspulse.app.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.campuspulse.app.MainActivity
import com.campuspulse.app.R
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class CampusFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Upload FCM token to backend for targeted student notifications
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val title = remoteMessage.notification?.title ?: remoteMessage.data["title"] ?: "CampusPulse Alert"
        val body = remoteMessage.notification?.body ?: remoteMessage.data["body"] ?: "New campus announcement"
        val category = remoteMessage.data["category"] ?: "general"

        showNotification(title, body, category)
    }

    private fun showNotification(title: String, body: String, category: String) {
        val channelId = "campus_urgent_alerts"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Campus Alerts & Deadlines",
                NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("notification_category", category)
        }

        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_campus_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)

        notificationManager.notify(System.currentTimeMillis().toInt(), builder.build())
    }
}`,
  },
  {
    fileName: 'AndroidManifest.xml',
    filePath: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    category: 'config',
    description: 'Android manifest declaring permissions (Internet, Notifications, Camera for QR ID), activities, and services',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:name=".CampusPulseApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.CampusPulse">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.CampusPulse">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".service.CampusFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
    </application>
</manifest>`,
  },
  {
    fileName: 'build.gradle.kts (App)',
    filePath: 'app/build.gradle.kts',
    language: 'groovy',
    category: 'config',
    description: 'Gradle build configuration with Compose, Hilt, Retrofit, Room, Firebase, and Gemini SDK dependencies',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.google.services)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.campuspulse.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.campuspulse.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)

    // Retrofit 2 & OkHttp
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    // Dagger Hilt
    implementation("com.google.dagger:hilt-android:2.51.1")
    ksp("com.google.dagger:hilt-compiler:2.51.1")

    // Firebase (Auth, Firestore, Cloud Messaging)
    implementation(platform("com.google.firebase:firebase-bom:33.7.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-messaging-ktx")
}`,
  },
];
