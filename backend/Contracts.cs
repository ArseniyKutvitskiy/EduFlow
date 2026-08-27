using System.ComponentModel.DataAnnotations;
namespace EduFlow.Api;

public record RegisterRequest([Required, MaxLength(80)] string FirstName, [Required, MaxLength(80)] string LastName, [Required, EmailAddress] string Email, [Required, MinLength(6)] string Password);
public record LoginRequest([Required, EmailAddress] string Email, [Required] string Password);
public record ProfileRequest([Required] string FirstName, [Required] string LastName, string? AvatarUrl, string? Bio);
public record CourseRequest([Required] string Title, [Required] string Description, int CategoryId, Guid? TeacherId, string? CoverUrl);
public record AssignmentRequest(int ModuleId, [Required] string Title, [Required] string Description, [Range(1, 10)] int DaysToComplete, string? AttachmentUrl, string? AttachmentName);
public record SubmissionRequest([Required] string TextAnswer, string? FileUrl);
public record GradeRequest([Range(1, 10)] int Score, string? Comment);
public record ReturnSubmissionRequest(string? Comment);
public record ModuleRequest([Required] string Title, string? Description, int Position);
public record MaterialRequest([Required] string Title, string? Description, [Required, Url] string Url, MaterialType Type);
public record TeacherMaterialRequest(int CourseId, int ModuleId, [Required] string Title, string? Description, [Required, Url] string Url, MaterialType Type);
public record AnnouncementRequest([Required] string Title, [Required] string Content);
public record EnrollmentRequest(Guid StudentId, int CourseId);
public record CreateTeacherRequest([Required] string FirstName, [Required] string LastName, [Required, EmailAddress] string Email, [Required, MinLength(6)] string Password);
public record ResetPasswordRequest([Required, MinLength(6)] string NewPassword);
public record ChangePasswordRequest([Required] string CurrentPassword, [Required, MinLength(6)] string NewPassword);
