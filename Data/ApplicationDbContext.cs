using CloudVault.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudVault.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Folder> Folders { get; set; } = null!;
        public DbSet<FileEntity> Files { get; set; } = null!;
        public DbSet<SharedItem> SharedItems { get; set; } = null!;
        public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;
        public DbSet<Device> Devices { get; set; } = null!;
        public DbSet<Setting> Settings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Table Names
            modelBuilder.Entity<FileEntity>().ToTable("files");
            modelBuilder.Entity<Folder>().ToTable("folders");
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<SharedItem>().ToTable("shared_items");
            modelBuilder.Entity<ActivityLog>().ToTable("activity_logs");
            modelBuilder.Entity<Device>().ToTable("devices");
            modelBuilder.Entity<Setting>().ToTable("settings");

            // Configure Email as Unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Set default values for timestamps
            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Folder configurations
            modelBuilder.Entity<Folder>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Folder>()
                .HasOne(f => f.Parent)
                .WithMany(f => f.Children)
                .HasForeignKey(f => f.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Folder>()
                .Property(f => f.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // File configurations
            modelBuilder.Entity<FileEntity>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FileEntity>()
                .HasOne(f => f.Folder)
                .WithMany()
                .HasForeignKey(f => f.FolderId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<FileEntity>()
                .Property(f => f.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<FileEntity>()
                .Property(f => f.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Shared Items configuration
            modelBuilder.Entity<SharedItem>()
                .HasOne(s => s.Owner)
                .WithMany()
                .HasForeignKey(s => s.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SharedItem>()
                .HasOne(s => s.SharedWith)
                .WithMany()
                .HasForeignKey(s => s.SharedWithId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SharedItem>()
                .Property(s => s.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Activity Logs configuration
            modelBuilder.Entity<ActivityLog>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ActivityLog>()
                .Property(a => a.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Device configurations
            modelBuilder.Entity<Device>()
                .HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Device>()
                .Property(d => d.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Setting configurations
            modelBuilder.Entity<Setting>()
                .HasIndex(s => s.SettingKey)
                .IsUnique();

            modelBuilder.Entity<Setting>()
                .Property(s => s.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        }
    }
}
